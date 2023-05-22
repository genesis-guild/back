import { AccountModule } from './account'
import { AdminModule } from './admin'
import { AuthModule } from './auth'
import { BadgeModule } from './badge'
import { ChainModule } from './chain'

export default [
  ChainModule,
  AdminModule,
  AuthModule,
  AccountModule,
  BadgeModule,
]
