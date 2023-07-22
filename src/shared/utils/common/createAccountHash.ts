import { AccountWS } from 'shared/types'
import { createHash } from 'shared/utils'

export const createAccountHash = ({
  accountId,
  chainType,
}: AccountWS): string => {
  return createHash({
    accountId: accountId.toLowerCase(),
    chainType,
    secret: process.env.ENCRYPT_KEY,
  })
}
