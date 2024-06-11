import type { Endpoint } from 'payload/config'
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import type Passkey from '../types/Passkey'
import pluginConfig from '../pluginConfig'
import {getUserByEmail} from "../utils";

const registerResponseEndpoint: Endpoint = {
  path: '/multi-auth/register/verify',
  method: 'post',
  root: true,
  handler: async (req, res) => {
    const body = req.body
    const user = await getUserByEmail(body.email, req.payload, pluginConfig.authCollectionSlug)

    console.log("verify")
    // @ts-ignore
    const currentOptions: PublicKeyCredentialCreationOptionsJSON = user.registrationOptions

    let verification
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: currentOptions.challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
      })
    } catch (error: any) {
      console.error(error)
      return res.status(400).send({ error: error.message })
    }

    const { verified } = verification
    const { registrationInfo } = verification
    const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } =
      registrationInfo

    const newPasskey: Passkey = {
      user: user.id,
      webAuthnUserID: currentOptions.user.id,
      credentialID: credentialID,
      publicKey: credentialPublicKey,
      counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      transports: body.response.transports.join(','),
    }

    // Save the new passkey to the database
    const payload = await req.payload.create({
      collection: 'authenticators',
      // @ts-expect-error
      data: newPasskey,
    })

    return res.json({ verified })
  },
}

export default registerResponseEndpoint
