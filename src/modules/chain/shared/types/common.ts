import { NftDto } from 'shared/dto/nft.dto'

import { ListDto } from '../dto/list.dto'

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
  value?: string
}

export interface CommonChainService {
  getMintAbi(): string
  getListAbi(listDto: ListDto): string
  getOwnedNfts(accountId: string): Promise<NftDto[]>
  verifyMessage(signature: Uint8Array, account: AccountWS): Promise<boolean>
}

export interface AccountWS {
  chainType: ChainType
  accountId: string
}
