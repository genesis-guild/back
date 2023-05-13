import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { CoreSchema } from 'shared/classes'

@Schema()
export class BadgeDto extends CoreSchema {
  @ApiProperty({ default: 'Player badge info?' })
  @Prop({ default: 'Player badge info?' })
  info: string

  @ApiProperty({ default: 'Player badge' })
  @Prop({ default: 'Player badge' })
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
  accountId: string
}

export const BadgeSchema = SchemaFactory.createForClass(BadgeDto)

export type BadgeDocument = BadgeDto & Document
