import type { Endpoint } from 'payload/config'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { getUserByEmail, getUserPasskeys } from '../utils'
import pluginConfig from '../pluginConfig'

const registerChallengeEndpoint: Endpoint = {
  path: '/multi-auth/register/challenge',
  method: 'post',
  root: true,
  handler: async (req, res) => {
    const body = req.body

    if (!body.email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    try {
      const user = await getUserByEmail(body.email, req.payload, pluginConfig.authCollectionSlug)

      const userPasskeys = await getUserPasskeys(user, req.payload)
      const rpName = pluginConfig.rpName
      const rpID = pluginConfig.rpID

      // Generate registration options
      const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userName: user.email,
        attestationType: 'none',
        excludeCredentials: userPasskeys.map((passkey: { credentialID: any; transports: any; }) => ({
          id: passkey.credentialID,
        })),
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
          authenticatorAttachment: 'platform',
        },
      })

      // save the options to the user
      await req.payload.update({
        collection: pluginConfig.authCollectionSlug,
        id: user.id,
        data: {
          registrationOptions: options,
        },
      })

      // Send the options back to the client
      res.json(options)
    } catch (error: unknown) {
      console.error('Error processing request:', error)
      res.status(500).send('Internal Server Error')
    }
  },
}

export default registerChallengeEndpoint
