import { Prop } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { ChainType } from 'modules/chain/shared/types'

export class NftContractDto {
  @ApiProperty()
  @Prop()
  address: string

  @ApiProperty()
  @Prop()
  name?: string

  @ApiProperty()
  @Prop()
  symbol?: string

  @ApiProperty()
  @Prop()
  totalSupply?: string
}

export class NftDto {
  @ApiProperty()
  @Prop()
  contract: NftContractDto

  @ApiProperty()
  @Prop()
  tokenId: string

  @ApiProperty()
  @Prop()
  title: string

  @ApiProperty()
  @Prop()
  description: string

  @ApiProperty({ enum: ChainType })
  @Prop({ enum: ChainType })
  chainType: ChainType

  @ApiProperty()
  @Prop()
  owner: string
}
