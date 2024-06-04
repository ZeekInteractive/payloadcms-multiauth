import type { Endpoint } from 'payload/config'
import { getUserByEmail } from '../utils'
import pluginConfig from '../pluginConfig'

const multiAuthPreEndpoint: Endpoint = {
  path: '/multi-auth/auth/pre',
  method: 'post',
  root: true,
  handler: async (req, res) => {
    // secure this request
    if (!req.body) {
      return res.status(400).json({message: 'Malformed request'})
    }

    const { email } = req.body

    const user = await getUserByEmail(email, req.payload, pluginConfig.authCollectionSlug)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // return user preferred authentication method
    return res.json({ authMethod: user.authMethod || 'password' })
  },
}

export default multiAuthPreEndpoint
