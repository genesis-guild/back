import { AccountModule } from './account'
import { AdminModule } from './admin'
import { AuthModule } from './auth'
import { BadgeModule } from './badge'
import { ChainModule } from './chain'
import { MarketModule } from './market'

export default [
  ChainModule,
  MarketModule,
  AdminModule,
  AccountModule,
  BadgeModule,
  AuthModule,
]
