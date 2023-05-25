import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChainModule } from 'modules/chain'

import { MarketController } from './controller'
import { ListItemDto, ListItemSchema } from './dto/list-item.dto'
import { MarketService } from './service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ListItemDto.name,
        schema: ListItemSchema,
      },
    ]),
    ChainModule,
  ],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [],
})
export class MarketModule {}
