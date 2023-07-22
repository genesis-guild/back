import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GameDto } from 'shared/dto/game.dto'
import { MongooseClassSerializerInterceptor } from 'shared/interceptors'

import { AuthSwagger } from './decorators/auth-swagger'
import { AuthDto } from './dto/auth.dto'
import { AdminService } from './service'

@UseInterceptors(MongooseClassSerializerInterceptor(GameDto))
@ApiTags('Admin Controller')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login' })
  @ApiBody({ type: AuthDto, required: true })
  @Post('login')
  auth(@Body() authDto: AuthDto): string {
    return this.adminService.auth(authDto)
  }

  @ApiOperation({ summary: 'Add game' })
  @ApiResponse({ status: 201, description: 'Add game' })
  @ApiBody({ type: GameDto, required: true })
  @AuthSwagger()
  @Post('add-game')
  async addGame(@Body() gameDto: GameDto): Promise<GameDto> {
    return await this.adminService.addGame(gameDto)
  }

  @ApiOperation({ summary: 'Get games' })
  @ApiResponse({ status: 200, description: 'Get games', type: [GameDto] })
  @Get('games')
  getGames(): Promise<GameDto[]> {
    return this.adminService.getGames()
  }
}
