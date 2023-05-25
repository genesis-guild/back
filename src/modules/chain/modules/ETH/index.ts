import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ETHService } from './service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [ETHService],
  exports: [ETHService],
})
export class ETHModule {}

export { ETHService }
