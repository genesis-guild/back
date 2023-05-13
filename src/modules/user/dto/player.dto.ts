import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { BadgeDto } from 'modules/badge'
import { Document, Schema as MSchema } from 'mongoose'
import { CoreSchema } from 'shared/classes'

import { Tokens } from '../decorators/tokens'

@Schema()
export class PlayerDto extends CoreSchema {
  @Prop()
  @Exclude()
  accountId: string

  @ApiProperty()
  @Prop({ type: MSchema.Types.ObjectId, ref: BadgeDto.name })
  @Type(() => BadgeDto)
  badge: BadgeDto

  @Tokens()
  totalEarnings: { token: string; amount: number }[]

  @Tokens()
  avgEarnings: { token: string; amount: number }[]

  @ApiProperty({ default: 0 })
  @Prop({ default: 0 })
  totalNfts: number

  @ApiProperty()
  @Prop()
  games: string[]
}

export const PlayerSchema = SchemaFactory.createForClass(PlayerDto)

export type PlayerDocument = PlayerDto & Document
