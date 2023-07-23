import { Inject, Injectable, forwardRef } from '@nestjs/common'

import { AccountService } from 'modules/account'

import { Account } from 'shared/types'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService,
  ) {}

  async login({ address, chainType }: Account): Promise<void> {
    const user = await this.accountService.getAccount(address)

    if (user) {
      return
    }

    await this.accountService.createAccount(address, chainType)
  }

  async merge(currAccountId: string, newAccount: Account): Promise<void> {
    await this.login(newAccount)

    await this.accountService.mergeAccounts(currAccountId, newAccount.address)
  }
}
