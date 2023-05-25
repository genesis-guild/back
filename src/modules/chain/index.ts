import { Module, forwardRef } from '@nestjs/common'
import { AccountModule } from 'modules/account'

import ChainModules from './modules'
import { ChainService } from './service'
import ChainSockets from './sockets'

@Module({
  imports: [...ChainModules, forwardRef(() => AccountModule)],
  controllers: [],
  providers: [...ChainSockets, ChainService],
  exports: [...ChainSockets, ChainService],
})
export class ChainModule {}

export { ChainService }
