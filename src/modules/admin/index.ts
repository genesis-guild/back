import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';



import { ACCESS_TOKEN_EXPIRES } from 'shared/consts';
import { GameDto, GameSchema } from 'shared/dto/game.dto';



import { AdminController } from './controller';
import { AdminService } from './service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_ADMIN!,
      signOptions: {
        expiresIn: ACCESS_TOKEN_EXPIRES,
      },
    }),
    MongooseModule.forFeature([{ name: GameDto.name, schema: GameSchema }]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

export { AdminService }