import { Injectable } from '@nestjs/common'
import { UserService } from 'modules/user'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async check(accountId: string): Promise<void> {
    const user = await this.userService.getUser(accountId)

    if (user) {
      return
    }

    await this.userService.createUser(accountId)
  }
}
