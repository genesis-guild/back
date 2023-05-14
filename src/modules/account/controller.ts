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
import { MongooseClassSerializerInterceptor } from 'shared/interceptors'

import { AccountGameDto, CommonGameDto } from './dto/account-game.dto'
import { AccountDto } from './dto/user.dto'
import { AccountService } from './service'

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
    enum: ['lender', 'player'],
    description: 'dashboard type',
    required: true,
  })
  @Get('dashboard/:type')
  async getDashboardInfo(
    @Param('type') type: 'lender' | 'player',
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
    enum: ['lender', 'player'],
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
    @Param('type') type: 'lender' | 'player',
    @Param('gameId') gameId: 'lender' | 'player',
    @Headers('accountId') accountId: string,
  ): Promise<AccountGameDto> {
    return await this.accountService.getAccountGameInfo(accountId, type, gameId)
  }
}
