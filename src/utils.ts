// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

export { getUserPasskeys }
