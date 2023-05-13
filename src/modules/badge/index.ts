import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ETHService } from 'services'

import { BadgeController } from './controller'
import { BadgeDto, BadgeSchema } from './dto/badge.dto'
import { BadgeService } from './service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BadgeDto.name, schema: BadgeSchema }]),
  ],
  controllers: [BadgeController],
  providers: [ETHService, BadgeService],
  exports: [BadgeService],
})
export class BadgeModule {}

export { BadgeService, BadgeDto }
