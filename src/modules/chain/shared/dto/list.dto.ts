import { NftDto } from 'shared/dto/nft.dto'

export class ListDto {
  pricePerDay: number

  nftDto: NftDto

  // in days
  duration: number
}
