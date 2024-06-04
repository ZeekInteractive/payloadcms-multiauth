import type { Endpoint } from 'payload/config'
import { randomBytes } from 'crypto'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { getUserByEmail, getUserPasskeys } from '../utils'
import pluginConfig from '../pluginConfig'

const loginResponseEndpoint: Endpoint = {
  path: '/multi-auth/auth/verify',
  method: 'post',
  root: true,
  handler: async (req, res) => {
    const { body } = req

    if (!body) {
      return res.status(400).json({ message: 'Malformed request' })
    }
    const user = await getUserByEmail(body.email, req.payload, pluginConfig.authCollectionSlug)

    if (user === null) {
      return res.status(404).json({ message: 'User not found' })
    }

    const passkeys = await getUserPasskeys(user, req.payload)

    const passkey = passkeys.find(
      (existingPasskey: { credentialID: any }) => existingPasskey.credentialID === body.asseResp.id,
    )

    if (!passkey) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    console.log({
      response: body.asseResp,
      expectedChallenge: user.registrationOptions.challenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
      authenticator: {
        credentialID: passkey.credentialID,
        credentialPublicKey: passkey.publicKey,
        counter: passkey.counter,
        transports: passkey.transports,
      },
    })
    let verification
    try {
      verification = await verifyAuthenticationResponse({
        response: body.asseResp,
        expectedChallenge: user.registrationOptions.challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        authenticator: {
          credentialID: passkey.credentialID,
          credentialPublicKey: passkey.publicKey,
          counter: passkey.counter,
          transports: passkey.transports,
        },
      })
    } catch (error) {
      console.error(error)
      return res.status(400).send({ error: error.message })
    }

    console.log(verification)

    const { verified } = verification

    const password = randomBytes(32).toString('hex')

    // await req.payload.update({
    //   collection: pluginConfig.authCollectionSlug,
    //   id: user.id,
    //   data: {password} as any,
    // })

    const loginData = {
      collection: pluginConfig.authCollectionSlug,
      data: {
        email: user.email,
        password: 'Caconmi08!',
      },
      req,
    }
    console.log(loginData)
    const result = await req.payload.login(loginData)

    const data = { success: true, data: result }
    console.log(data)
    return res.json(data)
  },
}

export default loginResponseEndpoint
