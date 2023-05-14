import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BadgeService } from 'modules/badge'
import { Model } from 'mongoose'

import { AccountGameDto, CommonGameDto } from './dto/account-game.dto'
import { LenderDto } from './dto/lender.dto'
import { PlayerDto } from './dto/player.dto'
import { AccountDto } from './dto/user.dto'

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(AccountDto.name) private userModel: Model<AccountDto>,
    @InjectModel(LenderDto.name) private lenderModel: Model<LenderDto>,
    @InjectModel(PlayerDto.name) private playerModel: Model<PlayerDto>,
    @InjectModel(AccountGameDto.name)
    private accountGameModel: Model<AccountGameDto>,
    private readonly badgeService: BadgeService,
  ) {}

  async getAccountInfo(accountId: string): Promise<AccountDto | null> {
    return await this.userModel
      .findOne({ accountId })
      .populate([{ path: 'player', populate: { path: 'badge' } }, 'lender'])
      .exec()
  }

  async createAccount(accountId: string): Promise<AccountDto> {
    return await this.userModel.create({
      accountId,
      lender: await this.createLender(accountId),
      player: await this.createPlayer(accountId),
    })
  }

  async createLender(accountId: string): Promise<LenderDto> {
    return await this.lenderModel.create({ accountId })
  }

  async createPlayer(accountId: string): Promise<PlayerDto> {
    return await this.playerModel.create({
      accountId,
      badge: await this.badgeService.createBadge(accountId),
    })
  }

  async getDashboardInfo(
    accountId: string,
    type: 'lender' | 'player',
  ): Promise<Omit<CommonGameDto, 'accountId'>[]> {
    return (await this.accountGameModel.find({ type, accountId }).exec()).map(
      ({ gameId, name, type, socials }) => ({ gameId, name, type, socials }),
    )
  }

  async getAccountGameInfo(
    accountId: string,
    type: 'lender' | 'player',
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
}
