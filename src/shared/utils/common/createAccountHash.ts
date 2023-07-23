import { Account } from 'shared/types'
import { createHash } from 'shared/utils'

export const createAccountHash = ({ address, chainType }: Account): string => {
  return createHash({
    address: address.toLowerCase(),
    chainType,
    secret: process.env.ENCRYPT_KEY,
  })
}
