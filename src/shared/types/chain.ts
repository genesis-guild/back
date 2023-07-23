export enum ChainType {
  ETH = 'eth',
}

export interface Account {
  chainType: ChainType
  address: string
}
