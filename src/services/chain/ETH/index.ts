import { Injectable } from '@nestjs/common'
import { Alchemy, Network, OwnedNftsResponse } from 'alchemy-sdk'

const settings = {
  apiKey: 'CYzAA_vmCDw9nmgxFGdNNFyPe08bUwtM',
  network: Network.ETH_MAINNET,
}

@Injectable()
export class ETHService {
  private alchemy = new Alchemy(settings)

  async getNfts(accountId: string): Promise<OwnedNftsResponse> {
    return await this.alchemy.nft.getNftsForOwner(accountId)
  }
}
