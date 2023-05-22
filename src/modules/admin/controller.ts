import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthDto } from './dto/auth.dto'
import { AdminService } from './service'

@ApiTags('Admin Controller')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminSerivce: AdminService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login' })
  @ApiBody({ type: AuthDto, required: true })
  @Post('login')
  auth(@Body() authDto: AuthDto): string {
    return this.adminSerivce.auth(authDto)
  }
}
