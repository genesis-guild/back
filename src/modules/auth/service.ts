import { Injectable } from '@nestjs/common'
import { AccountService } from 'modules/account'

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}

  async check(accountId: string): Promise<void> {
    const user = await this.accountService.getAccountInfo(accountId)

    if (user) {
      return
    }

    await this.accountService.createAccount(accountId)
  }
}
