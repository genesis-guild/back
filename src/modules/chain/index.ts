import { Module, forwardRef } from '@nestjs/common'

import { AccountModule } from 'modules/account'
import { AuthModule } from 'modules/auth'

import ChainModules from './modules'
import { ChainService } from './service'
import { AuthService as ChainAuthService } from './shared/services/authService'
import ChainSockets from './sockets'

@Module({
  imports: [...ChainModules, forwardRef(() => AccountModule), AuthModule],
  controllers: [],
  providers: [...ChainSockets, ChainService, ChainAuthService],
  exports: [...ChainSockets, ChainService],
})
export class ChainModule {}

export { ChainService }
