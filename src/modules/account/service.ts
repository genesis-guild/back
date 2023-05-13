import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BadgeService } from 'modules/badge'
import { Model } from 'mongoose'

import { LenderDto } from './dto/lender.dto'
import { PlayerDto } from './dto/player.dto'
import { AccountDto } from './dto/user.dto'

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(AccountDto.name) private userModel: Model<AccountDto>,
    @InjectModel(LenderDto.name) private lenderModel: Model<LenderDto>,
    @InjectModel(PlayerDto.name) private playerModel: Model<PlayerDto>,
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
}
