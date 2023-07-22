export enum ChainType {
  ETH = 'eth',
}

export interface AccountWS {
  chainType: ChainType
  accountId: string
}
