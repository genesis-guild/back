import { Prop } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

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
}
