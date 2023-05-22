import { Module } from '@nestjs/common'

import { ETHModule } from './ETH'
import { ChainSockets } from './sockets'

@Module({
  imports: [ETHModule],
  controllers: [],
  providers: [ChainSockets],
  exports: [ChainSockets],
})
export class ChainModule {}
