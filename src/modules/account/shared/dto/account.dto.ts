import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { Document, Schema as MSchema } from 'mongoose'

import { ChainType } from 'shared/types'

export class AccountInfo {
  @ApiProperty({ default: false })
  @Prop({ default: false })
  hasBadge: boolean
}

@Schema({
  collection: 'accounts',
})
export class AccountDto extends AccountInfo {
  @ApiProperty()
  @Prop()
  address: string

  @ApiProperty({ enum: ChainType })
  @Prop({ enum: ChainType })
  chainType: ChainType

  @ApiProperty({ default: false })
  @Prop({ default: false })
  linked?: boolean
}

@Schema({
  collection: 'merged-accounts',
})
export class MergedAccountDto {
  @ApiProperty()
  @Prop()
  accountsIds: string[]

  @ApiProperty()
  @Prop({
    type: [{ type: MSchema.Types.ObjectId, ref: AccountDto.name }],
  })
  @Type(() => AccountDto)
  accounts: AccountDto[]
}

export const AccountSchema = SchemaFactory.createForClass(AccountDto)
export const MergedAccountSchema =
  SchemaFactory.createForClass(MergedAccountDto)

export type AccountDocument = AccountDto & Document
export type MergedAccountDocument = MergedAccountDto & Document
