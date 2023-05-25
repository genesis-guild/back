import { Injectable } from '@nestjs/common'
import { Alchemy, Network } from 'alchemy-sdk'
import { AbiService } from 'modules/chain/shared/services/abiService'
import { CommonChainService } from 'modules/chain/shared/types'
import { getConfig } from 'modules/chain/shared/utils/alchemyConfig'
import { NftDto } from 'shared/dto/nft.dto'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

import { AbiType, ChainType } from '../../shared/types/common'

const alchemy = new Alchemy(getConfig(Network.ETH_GOERLI))

@Injectable()
export class ETHService extends AbiService implements CommonChainService {
  private web3: Web3

  constructor() {
    super(ChainType.ETH)
    this.web3 = new Web3(process.env.ETH_ALCHEMY_NODE_URL!)
  }

  getMintAbi(): string {
    const rentableContract = this.getContract(AbiType.RENTABLE_ABI)

    return rentableContract.methods.mint('').encodeABI()
  }

  async getOwnedNfts(accountId: string): Promise<NftDto[]> {
    const nfts = await alchemy.nft.getNftsForOwner(accountId)

    return nfts.ownedNfts.map(
      ({
        contract: { address, name, symbol, totalSupply },
        tokenId,
        title,
        description,
      }) => ({
        contract: {
          address,
          name,
          symbol,
          totalSupply,
        },
        tokenId,
        title,
        description,
      }),
    )
  }

  async getAllListed(): Promise<any> {
    const marketContract = this.getContract(AbiType.MARKET_ABI)

    const allListed = await marketContract.methods.getAllListings().call()
    // [ownerAccountAddress, user, nftContractAddress, tokenId, pricePerDay, startDateUNIX, endDateUNIX, expires]

    return allListed.map(
      ([
        ownerAccountAddress,
        user,
        nftContractAddress,
        tokenId,
        pricePerDay,
        startDateUNIX,
        endDateUNIX,
        expires,
      ]) => ({
        ownerAccountId: ownerAccountAddress,
        user,
        nftContractAddress,
        tokenId,
        pricePerDay,
        startDateUNIX,
        endDateUNIX,
        expires,
        chainType: this.chainType,
      }),
    )
  }

  private getContract(abiType: AbiType): Contract {
    return new this.web3.eth.Contract(...this.getContractCreds(abiType))
  }
}
