import type { Endpoint } from 'payload/config'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { getUserByEmail, getUserPasskeys } from '../utils'
import pluginConfig from '../pluginConfig'

const loginChallengeEndpoint: Endpoint = {
  path: '/multi-auth/auth/challenge',
  method: 'post',
  root: true,
  handler: async (req, res) => {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ message: 'Email missing' })
    }

    const user = await getUserByEmail(req.body.email, req.payload, pluginConfig.authCollectionSlug)
    const userPasskeys = await getUserPasskeys(user, req.payload)

    const options = await generateAuthenticationOptions({
      rpID: 'localhost', // Use your actual domain in production
      allowCredentials: userPasskeys.map((passkey: { credentialID: string }) => ({
        id: passkey.credentialID,
        type: 'public-key',
        transports: ['usb', 'nfc', 'ble', 'internal'],
      })),
      userVerification: 'preferred',
    })

    await req.payload.update({
      collection: pluginConfig.authCollectionSlug,
      id: user.id,
      data: { registrationOptions: options } as any,
    })

    res.json(options)

    return res
  },
}

export default loginChallengeEndpoint
