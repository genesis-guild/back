import { Injectable, Logger, Optional } from '@nestjs/common'

import { Account, ChainType } from 'shared/types'

import { ETHService } from './modules/ETH'
import { AbiType } from './shared/types/common'

@Injectable()
export class ChainService {
  abiContract: Record<ChainType, Record<AbiType, string>> = {
    [ChainType.ETH]: {
      [AbiType.MARKET_ABI]: process.env.ETH_MARKETPLACE_CONTRACT!,
      [AbiType.RENTABLE_ABI]: process.env.ETH_RENTABLE_CONTRACT!,
    },
  }

  constructor(
    private readonly ethService: ETHService,
    @Optional() private readonly logger = new Logger(ChainService.name),
  ) {}

  getService(chainType: Account['chainType']): ETHService {
    switch (chainType) {
      case ChainType.ETH:
        return this.ethService
    }
  }
}
