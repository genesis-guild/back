import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BadgeModule } from 'modules/badge'
import { ETHService } from 'services'

import { AccountController } from './controller'
import { LenderDto, LenderSchema } from './dto/lender.dto'
import { PlayerDto, PlayerSchema } from './dto/player.dto'
import { AccountDto, AccountSchema } from './dto/user.dto'
import { AccountService } from './service'

export const Models = [
  MongooseModule.forFeature([{ name: AccountDto.name, schema: AccountSchema }]),
  MongooseModule.forFeature([{ name: LenderDto.name, schema: LenderSchema }]),
  MongooseModule.forFeature([{ name: PlayerDto.name, schema: PlayerSchema }]),
]

@Module({
  imports: [...Models, BadgeModule],
  controllers: [AccountController],
  providers: [ETHService, AccountService],
  exports: [AccountService, ...Models],
})
export class AccountModule {}

export { AccountService }
