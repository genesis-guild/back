import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NftDto } from 'shared/dto/nft.dto'
import { MongooseClassSerializerInterceptor } from 'shared/interceptors'

import { ListItemDto } from './dto/list-item.dto'
import { MarketService } from './service'

@UseInterceptors(MongooseClassSerializerInterceptor(ListItemDto))
@ApiTags('Market Controller')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({ summary: 'Get all listings' })
  @ApiResponse({
    status: 200,
    description: 'Get all listings',
    type: [ListItemDto],
  })
  @Get('all-listings')
  async getListedNfts(): Promise<ListItemDto[]> {
    return await this.marketService.getAllListings()
  }

  @ApiOperation({ summary: 'List an NFT' })
  @ApiBody({ type: NftDto })
  @ApiResponse({
    status: 200,
    description: 'List an NFT',
    type: ListItemDto,
  })
  @Post('list')
  async list(@Body() nftDto: NftDto): Promise<void> {
    await this.marketService.list(nftDto)
  }
}
