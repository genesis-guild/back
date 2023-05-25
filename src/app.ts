import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import Modules from 'modules'
import { GlobalHttpModule } from 'shared/modules/globalHttpModule'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CacheModule.register({ isGlobal: true }),
    GlobalHttpModule,
    ...Modules,
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL!),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
