import { Module } from '@nestjs/common'
import { AccountModule } from 'modules/account'

import { AuthController } from './controller'
import { AuthService } from './service'

@Module({
  imports: [AccountModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
