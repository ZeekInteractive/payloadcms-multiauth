// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
import { TypeWithID } from 'payload/types'

const getUserPasskeys = async (user: any, payload: any) => {
  const passkeys = await payload.find({
    collection: 'authenticators',
    where: {
      user: user.id,
    },
  })

  if (!passkeys || passkeys.length === 0) {
    return []
  }

  return passkeys.docs
}

const getUserByEmail = async (
  email: string,
  payload: any,
  collectionSlug: any,
): Promise<any | null> => {
  const users = await payload.find({
    collection: collectionSlug,
    where: { email: { equals: email } },
    depth: 2,
  })

  if (!users || users.length === 0) {
    return null
  }

  return users.docs[0]
}

export { getUserPasskeys, getUserByEmail }
