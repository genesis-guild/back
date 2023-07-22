import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { ACCESS_TOKEN_EXPIRES } from 'shared/consts'

import { AuthAccountDto, AuthAccountSchema } from './dto/auth-account.dto'
import { AuthService } from './service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forFeature([
      { name: AuthAccountDto.name, schema: AuthAccountSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: {
        expiresIn: ACCESS_TOKEN_EXPIRES,
      },
    }),
  ],
  controllers: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

export { AuthService }
