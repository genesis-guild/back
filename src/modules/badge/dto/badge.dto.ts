import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

import { CoreSchema } from 'shared/classes'

@Schema({
  collection: 'badges',
})
export class BadgeDto extends CoreSchema {
  @ApiProperty({ default: 'Borrower badge info?' })
  @Prop({ default: 'Borrower badge info?' })
  info: string

  @ApiProperty({ default: 'Borrower badge' })
  @Prop({ default: 'Borrower badge' })
  name: string

  @ApiProperty({ default: false })
  @Prop({ default: false })
  minted: boolean

  @ApiProperty({ default: 0 })
  @Prop({ default: 0 })
  lvl: number

  @ApiProperty({ default: 0 })
  @Prop({ default: 0 })
  exp: number

  @Prop()
  @Exclude()
  address: string
}

export const BadgeSchema = SchemaFactory.createForClass(BadgeDto)

export type BadgeDocument = BadgeDto & Document
