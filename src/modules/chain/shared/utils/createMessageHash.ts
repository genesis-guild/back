import { createHash } from 'shared/utils'

import { AccountWS } from '../types'

export const createMessageHash = ({
  accountId,
  chainType,
}: AccountWS): string => {
  return createHash({
    accountId: accountId.toLowerCase(),
    chainType,
    secret: process.env.ENCRYPT_KEY,
  })
}
