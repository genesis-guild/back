import { Network } from 'alchemy-sdk'

export const getConfig = (
  network: Network,
): { apiKey: string; network: Network } => ({
  apiKey: process.env.ETH_ALCHEMY_API_KEY!,
  network,
})
