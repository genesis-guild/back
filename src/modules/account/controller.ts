import { Controller, Get, Headers, UseInterceptors } from '@nestjs/common'
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MongooseClassSerializerInterceptor } from 'shared/interceptors'

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
    description: 'Get account info',
    required: true,
  })
  @Get()
  async getAccountInfo(
    @Headers('accountId') accountId: string,
  ): Promise<AccountDto | null> {
    return await this.accountService.getAccountInfo(accountId)
  }
}
