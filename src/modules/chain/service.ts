import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Optional,
  forwardRef,
} from '@nestjs/common'
import { AccountService } from 'modules/account'

import { ETHService } from './modules/ETH'
import { AbiType, ChainType } from './shared/types/common'

@Injectable()
export class ChainService {
  abiContract: Record<ChainType, Record<AbiType, string>> = {
    [ChainType.ETH]: {
      [AbiType.MARKET_ABI]: process.env.ETH_MARKETPLACE_CONTRACT!,
      [AbiType.RENTABLE_ABI]: process.env.ETH_RENTABLE_CONTRACT!,
    },
  }

  constructor(
    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService,
    private readonly ethService: ETHService,
    @Optional() private readonly logger = new Logger(ChainService.name),
  ) {}

  async getService(accountId: string): Promise<ETHService> {
    const chainType = (await this.accountService.getAccount(accountId))
      ?.chainType

    if (!chainType) {
      throw new HttpException(
        `User ${accountId} not found`,
        HttpStatus.BAD_REQUEST,
      )
    }

    switch (chainType) {
      case ChainType.ETH:
        return this.ethService
    }
  }
}
