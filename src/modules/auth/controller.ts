import { Controller, Headers, Post } from '@nestjs/common'
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ChainType } from 'modules/chain/shared/types'

import { AuthService } from './service'

@ApiTags('Auth Controller')
@ApiResponse({ status: 200, description: 'Success' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login' })
  @Post('login')
  @ApiHeader({
    name: 'accountId',
    description: 'User account id',
    required: true,
  })
  @ApiHeader({
    name: 'chainType',
    enum: ChainType,
    description: 'User account chain type',
    required: true,
  })
  async login(
    @Headers('accountId') accountId: string,
    @Headers('chainType') chainType: ChainType,
  ): Promise<void> {
    await this.authService.check(accountId, chainType)
  }
}
