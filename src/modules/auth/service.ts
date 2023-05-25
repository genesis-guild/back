import { Injectable } from '@nestjs/common'
import { AccountService } from 'modules/account'
import { ChainType } from 'modules/chain/shared/types'

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}

  async check(accountId: string, chainType: ChainType): Promise<void> {
    const user = await this.accountService.getAccountInfo(accountId)

    if (user) {
      return
    }

    await this.accountService.createAccount(accountId, chainType)
  }
}
