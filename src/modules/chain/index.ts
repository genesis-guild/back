import { Module, forwardRef } from '@nestjs/common'
import { AccountModule } from 'modules/account'

import ChainModules from './modules'
import { ChainService } from './service'
import { AuthService } from './shared/services/authService'
import ChainSockets from './sockets'

@Module({
  imports: [...ChainModules, forwardRef(() => AccountModule)],
  controllers: [],
  providers: [...ChainSockets, ChainService, AuthService],
  exports: [...ChainSockets, ChainService],
})
export class ChainModule {}

export { ChainService }
