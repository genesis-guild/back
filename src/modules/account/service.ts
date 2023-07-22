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

  async getAccountInfo(accountId: string): Promise<AccountInfo | null> {
    const account = await this.getAccount(accountId)

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
    }

    if (account.linked) {
      const mergedAccount = await this.getMergedAccount(accountId)

      if (!mergedAccount) {
        throw new HttpException('Account not merged!', HttpStatus.NOT_FOUND)
      }

      return collectAccountInfo(mergedAccount.accounts)
    }

    return collectAccountInfo(account)
  }

  async getAccount(accountId: string): Promise<AccountDto | null> {
    const account = await this.userModel
      .findOne({ accountId: accountId.toLowerCase() })
      .exec()

    return account
  }

  async createAccount(
    accountId: string,
    chainType: ChainType,
  ): Promise<AccountDto> {
    return await this.userModel.create({
      accountId: accountId.toLowerCase(),
      chainType,
    })
  }

  async getMergedAccount(
    accountId: string,
    populate = true,
  ): Promise<MergedAccountDto | null> {
    const mergedAccount = this.mergedAccountModel.findOne({
      accountsIds: { $in: [accountId.toLowerCase()] },
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

  async unlinkAccount(accountId: string): Promise<void> {
    const mergedAccount = await this.getMergedAccount(accountId)
    const account = await this.getAccount(accountId)

    if (!mergedAccount || !account) return

    await this.mergedAccountModel.findOneAndUpdate(
      { accountsIds: { $in: [accountId.toLowerCase()] } },
      { $pull: { accounts: account, accountsIds: accountId.toLowerCase() } },
    )

    await this.changeLinkAccount(accountId, false)
  }

  async changeLinkAccount(accountId: string, linked: boolean): Promise<void> {
    await this.userModel.findOneAndUpdate(
      {
        accountId: accountId.toLowerCase(),
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

  async getOwnedNfts(accountId: string): Promise<NftDto[]> {
    // get nfts on chain
    const chainNfts =
      (await (
        await this.chainService.getService(accountId)
      )?.getOwnedNfts(accountId)) ?? []

    // get Games nft contracts
    const availableGamesNftContracts = (await this.adminService.getGames())
      .map(({ nftContracts }) => nftContracts)
      .flatMap(c => c.map(a => a.toLowerCase()))

    // get listings hash
    const listingsHash = (await this.marketService.getAllListings()).map(
      ({ hash }) => hash,
    )

    const abailableNfts = chainNfts
      .filter(({ contract: { address } }) =>
        availableGamesNftContracts.includes(address.toLowerCase()),
      )
      .filter(
        nftDto => !listingsHash.includes(this.marketService.getNftHash(nftDto)),
      )

    return abailableNfts
  }
}
