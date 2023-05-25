import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { Document } from 'mongoose'
import { CoreSchema } from 'shared/classes'

import { Tokens } from '../decorators/tokens'

@Schema({
  collection: 'lenders',
})
export class LenderDto extends CoreSchema {
  @Prop()
  @Exclude()
  accountId: string

  @Tokens()
  totalEarnings: { token: string; amount: number }[]

  @Tokens()
  avgErnings: { token: string; amount: number }[]

  @ApiProperty({ default: 0 })
  @Prop({ default: 0 })
  totalNfts: number

  @ApiProperty()
  @Prop()
  games: string[]
}

export const LenderSchema = SchemaFactory.createForClass(LenderDto)

export type LenderDocument = LenderDto & Document
