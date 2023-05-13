import { Module } from '@nestjs/common'
import { UserModule } from 'modules/user'

import { AuthController } from './controller'
import { AuthService } from './service'

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
