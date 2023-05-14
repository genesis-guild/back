import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class CommonGameDto {
  @Prop()
  @Exclude()
  accountId: string

  @ApiProperty()
  @Prop()
  gameId: string

  @ApiProperty()
  @Prop()
  name: string

  @ApiProperty({ enum: ['lender', 'player'] })
  @Prop({ enum: ['lender', 'player'] })
  type: 'lender' | 'player'

  @ApiProperty()
  @Prop()
  socials: []
}

@Schema()
export class AccountGameDto extends CommonGameDto {
  @ApiProperty({
    type: 'object',
    properties: {
      token: { type: 'string' },
      amount: { type: 'number' },
    },
  })
  @Prop(
    raw({
      token: { type: String },
      amount: { type: Number },
    }),
  )
  totalEarnings: { token: string; amount: number }

  @ApiProperty({
    type: 'object',
    properties: {
      token: { type: 'string' },
      amount: { type: 'number' },
    },
  })
  @Prop(
    raw({
      token: { type: String },
      amount: { type: Number },
    }),
  )
  avgEarnings: { token: string; amount: number }

  @ApiProperty({ default: 0 })
  @Prop({ default: 0 })
  totalNfts: number
}

export const AccountGameSchema = SchemaFactory.createForClass(AccountGameDto)

export type AccountGameDocument = AccountGameDto & Document
