import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { ChainType } from 'modules/chain/shared/types'
import { Document, Schema as MSchema } from 'mongoose'
import { CoreSchema } from 'shared/classes'

import { BorrowerDto } from './borrower.dto'
import { LenderDto } from './lender.dto'

@Schema({
  collection: 'accounts',
})
export class AccountDto extends CoreSchema {
  @Prop()
  @Exclude()
  accountId: string

  @ApiProperty()
  @Prop({ type: MSchema.Types.ObjectId, ref: LenderDto.name })
  @Type(() => LenderDto)
  lender: LenderDto

  @ApiProperty()
  @Prop({ type: MSchema.Types.ObjectId, ref: BorrowerDto.name })
  @Type(() => BorrowerDto)
  borrower: BorrowerDto

  @ApiProperty({ enum: ChainType })
  @Prop({ enum: ChainType })
  chainType: ChainType
}

export const AccountSchema = SchemaFactory.createForClass(AccountDto)

export type AccountDocument = AccountDto & Document
