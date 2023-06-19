import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { AccountService } from 'modules/account'
import { ChainType } from 'modules/chain/shared/types'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService,
  ) {}

  async login(accountId: string, chainType: ChainType): Promise<void> {
    const user = await this.accountService.getAccount(accountId)

    if (user) {
      return
    }

    await this.accountService.createAccount(accountId, chainType)
  }

  async merge(
    currAccountId: string,
    newAccount: { accountId: string; chainType: ChainType },
  ): Promise<void> {
    await this.login(newAccount.accountId, newAccount.chainType)

    await this.accountService.mergeAccounts(currAccountId, newAccount.accountId)
  }
}
