import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import { AbiCache, AbiCacheContract } from '../consts/cache'
import { ChainType } from '../types/common'

@Injectable()
export class ETHService {
  private web3: Web3
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // TODO move to Web3Module
    this.web3 = new Web3(
      'https://goerli.infura.io/v3/c53f0806e5244dd1b19ae8fbf3bd35bb',
    )
  }

  async getCachedAbi(type: AbiCache): Promise<AbiItem | AbiItem[]> {
    const abi: string = (await this.cacheManager.get(
      `${type}_${ChainType.ETH}`,
    ))!

    return JSON.parse(abi)
  }

  async getContract(abiType: AbiCache): Promise<Contract> {
    const abi = await this.getCachedAbi(abiType)

    return new this.web3.eth.Contract(abi, AbiCacheContract[abiType])
  }

  async getMintAbi(): Promise<string> {
    const rentableContract = await this.getContract(AbiCache.RENTABLE_ABI)

    return rentableContract.methods.mint('asd').encodeABI()
  }
}
