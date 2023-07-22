import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

import { CoreSchema } from 'shared/classes/core-schema'

@Schema({
  collection: 'games',
})
export class GameDto extends CoreSchema {
  @ApiProperty()
  @Prop()
  nftContracts: string[]

  @ApiProperty()
  @Prop()
  name: string

  @ApiProperty()
  @Prop()
  description: string
}

export const GameSchema = SchemaFactory.createForClass(GameDto)

export type GameDocument = GameDto & Document
