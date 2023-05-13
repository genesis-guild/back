import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { Document, Schema as MSchema } from 'mongoose'
import { CoreSchema } from 'shared/classes'

import { LenderDto } from './lender.dto'
import { PlayerDto } from './player.dto'

@Schema()
export class UserDto extends CoreSchema {
  @Prop()
  @Exclude()
  accountId: string

  @ApiProperty()
  @Prop({ type: MSchema.Types.ObjectId, ref: LenderDto.name })
  @Type(() => LenderDto)
  lender: LenderDto

  @ApiProperty()
  @Prop({ type: MSchema.Types.ObjectId, ref: PlayerDto.name })
  @Type(() => PlayerDto)
  player: PlayerDto
}

export const UserSchema = SchemaFactory.createForClass(UserDto)

export type UserDocument = UserDto & Document
