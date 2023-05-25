import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AdminService } from 'modules/admin'
import { BadgeService } from 'modules/badge'
import { ChainService } from 'modules/chain'
import { ChainType } from 'modules/chain/shared/types'
import { Model } from 'mongoose'
import { NftDto } from 'shared/dto/nft.dto'

import {
  AccountDto,
  AccountGameDto,
  AccountType,
  BorrowerDto,
  CommonGameDto,
  LenderDto,
} from './shared'

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(AccountDto.name) private userModel: Model<AccountDto>,
    @InjectModel(LenderDto.name) private lenderModel: Model<LenderDto>,
    @InjectModel(BorrowerDto.name) private borrowerModel: Model<BorrowerDto>,
    @InjectModel(AccountGameDto.name)
    private accountGameModel: Model<AccountGameDto>,
    private readonly badgeService: BadgeService,
    @Inject(forwardRef(() => ChainService))
    private readonly chainService: ChainService,
    private readonly adminService: AdminService,
  ) {}

  async getAccountInfo(accountId: string): Promise<AccountDto | null> {
    return await this.userModel
      .findOne({ accountId })
      .populate([
        { path: AccountType.BORROWER, populate: { path: 'badge' } },
        AccountType.LENDER,
      ])
      .exec()
  }

  async createAccount(
    accountId: string,
    chainType: ChainType,
  ): Promise<AccountDto> {
    return await this.userModel.create({
      accountId,
      [AccountType.LENDER]: await this.createLender(accountId),
      [AccountType.BORROWER]: await this.createBorrower(accountId),
      chainType,
    })
  }

  async createLender(accountId: string): Promise<LenderDto> {
    return await this.lenderModel.create({ accountId })
  }

  async createBorrower(accountId: string): Promise<BorrowerDto> {
    return await this.borrowerModel.create({
      accountId,
      badge: await this.badgeService.createBadge(accountId),
    })
  }

  async getDashboardInfo(
    accountId: string,
    type: AccountType,
  ): Promise<Omit<CommonGameDto, 'accountId'>[]> {
    return (await this.accountGameModel.find({ type, accountId }).exec()).map(
      ({ gameId, name, type, socials }) => ({ gameId, name, type, socials }),
    )
  }

  async getAccountGameInfo(
    accountId: string,
    type: AccountType,
    gameId: string,
  ): Promise<AccountGameDto> {
    const game = await this.accountGameModel.findOne({
      accountId,
      type,
      gameId,
    })

    if (!game) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }

    return game
  }

  async getOwnedNfts(accountId: string): Promise<NftDto[]> {
    const chainNfts = await (
      await this.chainService.getService(accountId)
    ).getOwnedNfts(accountId)
    const availableGamesContracts = (await this.adminService.getGames())
      .map(({ nftContracts }) => nftContracts)
      .flatMap(c => c.map(a => a.toLowerCase()))

    return chainNfts.filter(({ contract: { address } }) => {
      return availableGamesContracts.includes(address.toLowerCase())
    })
  }
}
