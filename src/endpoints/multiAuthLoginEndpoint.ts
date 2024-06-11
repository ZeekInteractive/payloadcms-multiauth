import type { Endpoint } from 'payload/config'
import { getUserByEmail } from '../utils'
import pluginConfig from '../pluginConfig'

const multiAuthLoginEndpoint: Endpoint = {
  path: '/multi-auth/auth/login',
  method: 'post',
  root: true,
  handler: async (req, res) => {
    // secure this request
    if (!req.body) {
      return res.status(400).json({ message: 'Malformed request' })
    }

    const { email, password } = req.body
    const user = await getUserByEmail(email, req.payload, pluginConfig.authCollectionSlug)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const loginData = {
      collection: pluginConfig.authCollectionSlug,
      data: {
        email,
        password,
      },
      req,
    }

    let result
    try {
      result = await req.payload.login(loginData)
    } catch (error: any) {
      console.log(error.message)
      return res.status(401).json({ message: error.message })
    }

    if (user.authMethod === 'password_2fa' && user.tokenValidation === false) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    const data = { success: true, data: result }
    return res.json(data)
  },
}

export default multiAuthLoginEndpoint
