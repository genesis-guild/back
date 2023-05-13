import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BadgeModule } from 'modules/badge'
import { ETHService } from 'services'

import { UserController } from './controller'
import { LenderDto, LenderSchema } from './dto/lender.dto'
import { PlayerDto, PlayerSchema } from './dto/player.dto'
import { UserDto, UserSchema } from './dto/user.dto'
import { UserService } from './service'

export const Models = [
  MongooseModule.forFeature([{ name: UserDto.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: LenderDto.name, schema: LenderSchema }]),
  MongooseModule.forFeature([{ name: PlayerDto.name, schema: PlayerSchema }]),
]

@Module({
  imports: [...Models, BadgeModule],
  controllers: [UserController],
  providers: [ETHService, UserService],
  exports: [UserService, ...Models],
})
export class UserModule {}

export { UserService }
