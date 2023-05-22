import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AdminService {
  constructor(private readonly jwtService: JwtService) {}

  auth({ username, password }: AuthDto): string {
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSOWORD
    ) {
      throw new HttpException(
        'Wrong password or username',
        HttpStatus.UNAUTHORIZED,
      )
    }

    return this.jwtService.sign({ username })
  }
}
