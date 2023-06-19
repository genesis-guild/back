import { AccountDto, AccountInfo } from '../dto'

export const collectAccountInfo = (
  accounts: AccountDto[] | AccountDto,
): AccountInfo => {
  if (!Array.isArray(accounts)) {
    return getAccountInfo(accounts)
  }

  return {
    hasBadge: accounts.some(account => account.hasBadge),
  }
}

export const getAccountInfo = (account: AccountDto): AccountInfo => {
  return {
    hasBadge: account.hasBadge,
  }
}
