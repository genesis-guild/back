import { NftDto } from 'shared/dto/nft.dto'
import { Account, ChainType } from 'shared/types'

import { ListDto } from '../dto/list.dto'

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
  data: string | undefined
  value?: string
}

export interface CommonChainService {
  getMintAbi(): string
  getListAbi(listDto: ListDto): string
  getOwnedNfts(address: string): Promise<NftDto[]>
  verifyMessage(signature: Uint8Array, account: Account): Promise<boolean>
}
