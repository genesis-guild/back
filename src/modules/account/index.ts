import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BadgeModule } from 'modules/badge'

import { AccountController } from './controller'
import { AccountGameDto, AccountGameSchema } from './dto/account-game.dto'
import { LenderDto, LenderSchema } from './dto/lender.dto'
import { PlayerDto, PlayerSchema } from './dto/player.dto'
import { AccountDto, AccountSchema } from './dto/user.dto'
import { AccountService } from './service'

export const Models = [
  MongooseModule.forFeature([{ name: AccountDto.name, schema: AccountSchema }]),
  MongooseModule.forFeature([{ name: LenderDto.name, schema: LenderSchema }]),
  MongooseModule.forFeature([{ name: PlayerDto.name, schema: PlayerSchema }]),
  MongooseModule.forFeature([
    { name: AccountGameDto.name, schema: AccountGameSchema },
  ]),
]

@Module({
  imports: [...Models, BadgeModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService, ...Models],
})
export class AccountModule {}

export { AccountService }
