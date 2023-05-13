import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import Modules from 'modules'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ...Modules,
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL!),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
