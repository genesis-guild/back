import { NftDto } from 'shared/dto/nft.dto'

export enum ChainType {
  ETH = 'eth',
}

export enum AbiType {
  MARKET_ABI = 'market_abi',
  RENTABLE_ABI = 'rentable_abi',
}

export const AbiContract: Record<ChainType, Record<AbiType, string>> = {
  [ChainType.ETH]: {
    [AbiType.MARKET_ABI]: process.env.ETH_MARKETPLACE_CONTRACT!,
    [AbiType.RENTABLE_ABI]: process.env.ETH_RENTABLE_CONTRACT!,
  },
}

export interface TransactionReqParamsType {
  from: string
  to: string
  data: string
}

export interface CommonChainService {
  getMintAbi(): string
  getOwnedNfts(accountId: string): Promise<NftDto[]>
}
