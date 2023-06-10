import {
  Controller,
  Get,
  Headers,
  Param,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { NftDto } from 'shared/dto/nft.dto'
import { MongooseClassSerializerInterceptor } from 'shared/interceptors'

import { AccountService } from './service'
import {
  AccountDto,
  AccountGameDto,
  AccountType,
  CommonGameDto,
} from './shared'

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
    name: 'accountId',
    description: 'User account id',
    required: true,
  })
  @Get()
  async getAccountInfo(
    @Headers('accountId') accountId: string,
  ): Promise<AccountDto | null> {
    return await this.accountService.getAccountInfo(accountId)
  }

  @ApiOperation({ summary: 'Get dashboard info' })
  @ApiResponse({
    status: 200,
    description: 'Get dashboard info',
    type: CommonGameDto,
  })
  @ApiHeader({
    name: 'accountId',
    description: 'User account id',
    required: true,
  })
  @ApiParam({
    name: 'type',
    enum: AccountType,
    description: 'Dashboard type',
    required: true,
  })
  @Get('dashboard/:type')
  async getDashboardInfo(
    @Param('type') type: AccountType,
    @Headers('accountId') accountId: string,
  ): Promise<Omit<CommonGameDto, 'accountId'>[]> {
    return await this.accountService.getDashboardInfo(accountId, type)
  }

  @ApiOperation({ summary: 'Get account game info' })
  @ApiResponse({
    status: 200,
    description: 'Get account game info',
    type: AccountGameDto,
  })
  @ApiHeader({
    name: 'accountId',
    description: 'User account id',
    required: true,
  })
  @ApiParam({
    name: 'type',
    enum: AccountType,
    description: 'Dashboard type',
    required: true,
  })
  @ApiParam({
    name: 'gameId',
    description: 'Game id',
    required: true,
  })
  @Get('dashboard/:type/:gameId')
  async getAccountGameInfo(
    @Param('type') type: AccountType,
    @Param('gameId') gameId: string,
    @Headers('accountId') accountId: string,
  ): Promise<AccountGameDto> {
    return await this.accountService.getAccountGameInfo(accountId, type, gameId)
  }

  @ApiOperation({ summary: 'Get account nfts' })
  @ApiResponse({
    status: 200,
    description: 'Get account nfts',
  })
  @ApiHeader({
    name: 'accountId',
    description: 'User account id',
    required: true,
  })
  @Get('nfts')
  async getOwnedNfts(
    @Headers('accountId') accountId: string,
  ): Promise<NftDto[]> {
    return await this.accountService.getOwnedNfts(accountId)
  }
}
