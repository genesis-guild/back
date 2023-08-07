export enum ChainType {
  ETH = 'eth',
}

export interface Account {
  chainType: ChainType
  address: string
}

export type SessionAccounts = [Account | undefined, Account | undefined]
