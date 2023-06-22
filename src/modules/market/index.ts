import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AdminModule } from 'modules/admin'
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
    AdminModule,
  ],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [MarketService],
})
export class MarketModule {}
