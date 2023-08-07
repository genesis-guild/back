import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { AdminService } from 'modules/admin'
import { ChainService } from 'modules/chain'
import { MarketService } from 'modules/market/service'

import { NftDto } from 'shared/dto/nft.dto'
import { ChainType } from 'shared/types'

import {
  AccountDto,
  AccountGameDto,
  AccountInfo,
  MergedAccountDto,
} from './shared'
import { collectAccountInfo } from './shared/utils/collect-account'

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(AccountDto.name) private userModel: Model<AccountDto>,
    @InjectModel(MergedAccountDto.name)
    private mergedAccountModel: Model<MergedAccountDto>,
    @InjectModel(AccountGameDto.name)
    @Inject(forwardRef(() => ChainService))
    private readonly chainService: ChainService,
    private readonly adminService: AdminService,
    private readonly marketService: MarketService,
  ) {}

  async getAccountInfo(address: string): Promise<AccountInfo | null> {
    const account = await this.getAccount(address)

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
    }

    if (account.linked) {
      const mergedAccount = await this.getMergedAccount(address)

      if (!mergedAccount) {
        throw new HttpException('Account not merged!', HttpStatus.NOT_FOUND)
      }

      return collectAccountInfo(mergedAccount.accounts)
    }

    return collectAccountInfo(account)
  }

  async isNew(address: string): Promise<{
    isNew: boolean
  }> {
    const account = await this.getAccount(address)

    return {
      isNew: !account,
    }
  }

  async getAccount(address: string): Promise<AccountDto | null> {
    const account = await this.userModel
      .findOne({ address: address.toLowerCase() })
      .exec()

    return account
  }

  async createAccount(
    address: string,
    chainType: ChainType,
  ): Promise<AccountDto> {
    return await this.userModel.create({
      address: address.toLowerCase(),
      chainType,
    })
  }

  async getMergedAccount(
    address: string,
    populate = true,
  ): Promise<MergedAccountDto | null> {
    const mergedAccount = this.mergedAccountModel.findOne({
      accountsIds: { $in: [address.toLowerCase()] },
    })

    if (populate) {
      return await mergedAccount.populate('accounts').exec()
    }

    return await mergedAccount.exec()
  }

  async mergeAccounts(
    currAccountId: string,
    newAccountId: string,
  ): Promise<void> {
    const mergedAccount = await this.getMergedAccount(currAccountId, false)

    if (mergedAccount) {
      await this.addToMergedAccount(currAccountId, newAccountId)

      return
    }

    const currAccount = await this.getAccount(currAccountId)
    const newAccount = await this.getAccount(newAccountId)

    if (!(currAccount && newAccount)) {
      throw new HttpException('Smth went wrong', HttpStatus.FORBIDDEN)
    }

    await this.mergedAccountModel.create({
      accountsIds: [currAccountId.toLowerCase(), newAccountId.toLowerCase()],
      accounts: [currAccount, newAccount],
    })

    await this.changeLinkAccount(currAccountId, true)
    await this.changeLinkAccount(newAccountId, true)
  }

  async unlinkAccount(address: string): Promise<void> {
    const mergedAccount = await this.getMergedAccount(address)
    const account = await this.getAccount(address)

    if (!mergedAccount || !account) return

    await this.mergedAccountModel.findOneAndUpdate(
      { accountsIds: { $in: [address.toLowerCase()] } },
      { $pull: { accounts: account, accountsIds: address.toLowerCase() } },
    )

    await this.changeLinkAccount(address, false)
  }

  async changeLinkAccount(address: string, linked: boolean): Promise<void> {
    await this.userModel.findOneAndUpdate(
      {
        address: address.toLowerCase(),
      },
      { $set: { linked: linked } },
    )
  }

  async addToMergedAccount(
    currAccountId: string,
    newAccountId: string,
  ): Promise<void> {
    const newAccount = await this.getAccount(newAccountId)

    await this.mergedAccountModel.findOneAndUpdate(
      { accountsIds: { $in: [currAccountId.toLowerCase()] } },
      { $addToSet: { accounts: newAccount, accountsIds: newAccountId } },
    )

    await this.changeLinkAccount(newAccountId, true)
  }

  getOwnedNfts(): NftDto[] {
    // // get nfts on chain
    // const chainNfts = []
    // // (await (
    // //   await this.chainService.getService(address)
    // // )?.getOwnedNfts(address)) ?? []

    // // get Games nft contracts
    // const availableGamesNftContracts = (await this.adminService.getGames())
    //   .map(({ nftContracts }) => nftContracts)
    //   .flatMap(c => c.map(a => a.toLowerCase()))

    // // get listings hash
    // const listingsHash = (await this.marketService.getAllListings()).map(
    //   ({ hash }) => hash,
    // )

    // const abailableNfts = chainNfts
    //   .filter(({ contract: { address } }) =>
    //     availableGamesNftContracts.includes(address.toLowerCase()),
    //   )
    //   .filter(
    //     nftDto => !listingsHash.includes(this.marketService.getNftHash(nftDto)),
    //   )

    return []
  }
}
