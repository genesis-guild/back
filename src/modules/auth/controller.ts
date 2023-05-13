import { Controller, Headers, Post } from '@nestjs/common'
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

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
  async login(@Headers('accountId') accountId: string): Promise<void> {
    await this.authService.check(accountId)
  }
}
