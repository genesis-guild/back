import { Controller, Get, Headers, Post } from '@nestjs/common'
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { BadgeDto } from './dto/badge.dto'
import { BadgeService } from './service'

@ApiTags('Badge Controller')
@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeSerivce: BadgeService) {}

  @ApiOperation({ summary: 'Get badge' })
  @ApiResponse({
    status: 200,
    description: 'Get badge',
    type: BadgeDto,
  })
  @Get()
  @ApiHeader({
    name: 'accountId',
    description: 'User account id',
    required: true,
  })
  async getUserBadges(
    @Headers('accountId') accountId: string,
  ): Promise<BadgeDto | null> {
    return await this.badgeSerivce.getUserBadge(accountId)
  }

  @ApiOperation({ summary: 'Mint badge' })
  @ApiResponse({
    status: 200,
    description: 'Mint badge',
  })
  @Post('mint')
  @ApiHeader({
    name: 'accountId',
    description: 'User account id',
    required: true,
  })
  mintBadge(@Headers('accountId') accountId: string): string {
    return `Mint badge for ${accountId}!`
  }
}
