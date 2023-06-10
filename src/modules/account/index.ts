import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AdminModule } from 'modules/admin'
import { BadgeModule } from 'modules/badge'
import { ChainModule } from 'modules/chain'
import { MarketModule } from 'modules/market'

import { AccountController } from './controller'
import { AccountService } from './service'
import {
  AccountDto,
  AccountGameDto,
  AccountGameSchema,
  AccountSchema,
  BorrowerDto,
  BorrowerSchema,
  LenderDto,
  LenderSchema,
} from './shared'

export const Models = [
  MongooseModule.forFeature([{ name: AccountDto.name, schema: AccountSchema }]),
  MongooseModule.forFeature([{ name: LenderDto.name, schema: LenderSchema }]),
  MongooseModule.forFeature([
    { name: BorrowerDto.name, schema: BorrowerSchema },
  ]),
  MongooseModule.forFeature([
    { name: AccountGameDto.name, schema: AccountGameSchema },
  ]),
]

@Module({
  imports: [...Models, BadgeModule, ChainModule, AdminModule, MarketModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService, ...Models],
})
export class AccountModule {}

export { AccountService }
