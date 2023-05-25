import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChainService } from 'modules/chain'

@ApiTags('Market Controller')
@Controller('market')
export class MarketController {
  constructor(private readonly chainService: ChainService) {}

  @Get('all-listings')
  getListedNfts(): any {
    return
  }
}
