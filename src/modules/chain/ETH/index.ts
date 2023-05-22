import { HttpModule, HttpService } from '@nestjs/axios'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Module,
  Optional,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AxiosError } from 'axios'
import { Cache } from 'cache-manager'
import { catchError, firstValueFrom } from 'rxjs'

import { AbiCache, AbiCacheContract } from '../consts/cache'
import { ChainType } from '../types/common'
import { ETHService } from './service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    HttpModule,
  ],
  controllers: [],
  providers: [ETHService],
  exports: [ETHService],
})
export class ETHModule {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    @Optional() private readonly logger = new Logger(ETHModule.name),
  ) {
    this.setAbi(AbiCache.MARKET_ABI)
    this.setAbi(AbiCache.RENTABLE_ABI)
  }

  async setAbi(type: AbiCache): Promise<void> {
    const abi = await firstValueFrom(
      this.httpService
        .get<{ result: string }>(
          `${process.env.ETHERSCAN_BASE_URL}/api?module=contract&action=getabi&address=${AbiCacheContract[type]}&apikey=${process.env.ETHERSCAN_API_KEY}`,
        )
        .pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err)

            throw new HttpException('Smth went wrong', HttpStatus.BAD_REQUEST)
          }),
        ),
    )

    if (!abi.data.result) {
      this.logger.error(`${type} not found'`)
    }

    await this.cacheManager.set(`${type}_${ChainType.ETH}`, abi.data.result)

    this.logger.log(`Set ETH ${type}`)
  }
}
