import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    try {
      const authHeader = req.headers.authorization
      const token: string = authHeader.split(' ')[1]

      if (!token) {
        throw new UnauthorizedException({ message: 'User not authorized' })
      }

      await this.jwtService.verify(token)

      return true
    } catch (e) {
      throw new UnauthorizedException({ message: 'User not authorized' })
    }
  }
}
