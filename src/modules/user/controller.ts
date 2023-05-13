import { Controller, Get, Headers, UseInterceptors } from '@nestjs/common'
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MongooseClassSerializerInterceptor } from 'shared/interceptors'

import { UserDto } from './dto/user.dto'
import { UserService } from './service'

@UseInterceptors(MongooseClassSerializerInterceptor(UserDto))
@ApiTags('User Controller')
@ApiResponse({ status: 200, description: 'Success' })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'Get user',
    type: UserDto,
  })
  @ApiHeader({
    name: 'accountId',
    description: 'User account id',
    required: true,
  })
  @Get()
  async getUser(
    @Headers('accountId') accountId: string,
  ): Promise<UserDto | null> {
    return await this.userService.getUser(accountId)
  }
}
