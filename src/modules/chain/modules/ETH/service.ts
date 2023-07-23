import { Injectable } from '@nestjs/common'
import { Alchemy, Network } from 'alchemy-sdk'
import { recoverMessageAddress } from 'viem'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

import { ListDto } from 'modules/chain/shared/dto/list.dto'
import { AbiService } from 'modules/chain/shared/services/abiService'
import { CommonChainService } from 'modules/chain/shared/types'
import { getConfig } from 'modules/chain/shared/utils/alchemyConfig'

import { NftDto } from 'shared/dto/nft.dto'
import { Account, ChainType } from 'shared/types'
import { createAccountHash } from 'shared/utils'

import { AbiType } from '../../shared/types/common'

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

    return rentableContract.methods.mint('asd').encodeABI()
  }

  getListAbi({ nftDto, pricePerDay, duration }: ListDto): string {
    const marketContract = this.getContract(AbiType.MARKET_ABI)
    const durationInSeconds = duration * 24 * 60 * 60
    const delay = 5 * 60 // 5 mins delay

    return marketContract.methods
      .listNFT(
        nftDto.contract.address, // should be
        nftDto.tokenId,
        pricePerDay,
        Math.ceil(Date.now() / 1000) + delay,
        Math.ceil(Date.now() / 1000) + durationInSeconds + delay,
      )
      .encodeABI()
  }

  async getOwnedNfts(address: string): Promise<NftDto[]> {
    const nfts = await alchemy.nft.getNftsForOwner(address)

    return nfts.ownedNfts.map(
      ({
        contract: { address, name, symbol, totalSupply },
        tokenId,
        title,
        description,
      }) => ({
        chainType: this.chainType,
        contract: {
          address,
          name,
          symbol,
          totalSupply,
        },
        tokenId,
        title,
        description,
        owner: address,
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

  async getContractFee(abiType: AbiType): Promise<number> {
    const marketContract = this.getContract(abiType)

    return await marketContract.methods.getListingFee().call()
  }

  async verifyMessage(
    signature: Uint8Array,
    account: Account,
  ): Promise<boolean> {
    // TODO: somehow protect signature, maybe Date?
    const address = await recoverMessageAddress({
      signature,
      message: createAccountHash(account),
    })

    return address === account.address
  }

  private getContract(abiType: AbiType): Contract {
    return new this.web3.eth.Contract(...this.getContractCreds(abiType))
  }
}
