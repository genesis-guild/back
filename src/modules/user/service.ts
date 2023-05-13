import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BadgeService } from 'modules/badge'
import { Model } from 'mongoose'

import { LenderDto } from './dto/lender.dto'
import { PlayerDto } from './dto/player.dto'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserDto.name) private userModel: Model<UserDto>,
    @InjectModel(LenderDto.name) private lenderModel: Model<LenderDto>,
    @InjectModel(PlayerDto.name) private playerModel: Model<PlayerDto>,
    private readonly badgeService: BadgeService,
  ) {}

  async getUser(accountId: string): Promise<UserDto | null> {
    return await this.userModel
      .findOne({ accountId })
      .populate([{ path: 'player', populate: { path: 'badge' } }, 'lender'])
      .exec()
  }

  async createUser(accountId: string): Promise<UserDto> {
    return await this.userModel.create({
      accountId,
      lender: await this.createLender(accountId),
      player: await this.createPlayer(accountId),
    })
  }

  async getLender(accountId: string): Promise<LenderDto | null> {
    return await this.lenderModel.findOne({ accountId }).exec()
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
