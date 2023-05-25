import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { AxiosError } from 'axios'
import { catchError, firstValueFrom } from 'rxjs'
import { AbiItem } from 'web3-utils'

import { AbiType, ChainType } from '../types'

@Injectable()
export class AbiService {
  chainType: ChainType
  abis: Record<AbiType, AbiItem | AbiItem[] | undefined> = {
    [AbiType.MARKET_ABI]: undefined,
    [AbiType.RENTABLE_ABI]: undefined,
  }

  AbiContract: Record<ChainType, Record<AbiType, string>> = {
    [ChainType.ETH]: {
      [AbiType.MARKET_ABI]: process.env.ETH_MARKETPLACE_CONTRACT!,
      [AbiType.RENTABLE_ABI]: process.env.ETH_RENTABLE_CONTRACT!,
    },
  }

  private httpService: HttpService
  private readonly logger = new Logger(AbiService.name)

  private ContractUrl: Record<ChainType, (abiType: AbiType) => string> = {
    [ChainType.ETH]: (abiType: AbiType) =>
      `${
        process.env.ETHERSCAN_BASE_URL
      }/api?module=contract&action=getabi&address=${
        this.AbiContract[this.chainType][abiType]
      }&apikey=${process.env.ETHERSCAN_API_KEY}`,
  }

  constructor(chainType: ChainType) {
    this.chainType = chainType
    this.httpService = new HttpService()
    Object.keys(this.AbiContract[chainType]).forEach((abiType: AbiType) =>
      this.setAbi(abiType),
    )
  }

  getContractCreds(abiType: AbiType): [AbiItem | AbiItem[], string] {
    return [this.abis[abiType]!, this.AbiContract[this.chainType][abiType]]
  }

  private async setAbi(abiType: AbiType): Promise<void> {
    this.abis[abiType] = await this.getAbi(abiType)
  }

  private async getAbi(abiType: AbiType): Promise<AbiItem | AbiItem[]> {
    const abi = await firstValueFrom(
      this.httpService
        .get<{ result: string }>(this.ContractUrl[this.chainType](abiType))
        .pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err)

            throw new HttpException(
              `Can't load abi for ${this.chainType} ${abiType}`,
              HttpStatus.BAD_REQUEST,
            )
          }),
        ),
    )

    if (!abi.data.result) {
      this.logger.error(`${this.chainType} ${abiType} not found'`)
    }

    this.logger.log(`Successfully loaded for ${this.chainType} ${abiType}`)

    return JSON.parse(abi.data.result) as AbiItem | AbiItem[]
  }
}
