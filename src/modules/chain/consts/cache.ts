export enum AbiCache {
  MARKET_ABI = 'market_abi',
  RENTABLE_ABI = 'rentable_abi',
}

export const AbiCacheContract: Record<AbiCache, string> = {
  [AbiCache.MARKET_ABI]: process.env.ETH_MARKETPLACE_CONTRACT!,
  [AbiCache.RENTABLE_ABI]: process.env.ETH_RENTABLE_CONTRACT!,
}
