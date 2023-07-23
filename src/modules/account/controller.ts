import { Controller, Get, Headers, UseInterceptors } from '@nestjs/common'
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { NftDto } from 'shared/dto/nft.dto'
import { MongooseClassSerializerInterceptor } from 'shared/interceptors'

import { AccountService } from './service'
import { AccountDto, AccountInfo } from './shared'

@UseInterceptors(MongooseClassSerializerInterceptor(AccountDto))
@ApiTags('Account Controller')
@ApiResponse({ status: 200, description: 'Success' })
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Get account info' })
  @ApiResponse({
    status: 200,
    description: 'Get account info',
    type: AccountDto,
  })
  @ApiHeader({
    name: 'address',
    description: 'User account id',
    required: true,
  })
  @Get()
  async getAccountInfo(
    @Headers('address') address: string,
  ): Promise<AccountInfo | null> {
    return await this.accountService.getAccountInfo(address)
  }

  @ApiOperation({ summary: 'Get account nfts' })
  @ApiResponse({
    status: 200,
    description: 'Get account nfts',
  })
  @ApiHeader({
    name: 'address',
    description: 'User account id',
    required: true,
  })
  @Get('nfts')
  // TODO: implement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOwnedNfts(@Headers('address') address: string): NftDto[] {
    // return await this.accountService.getOwnedNfts(address)

    return []
  }
}
