import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { BadgeDto } from './dto/badge.dto'

@Injectable()
export class BadgeService {
  constructor(
    @InjectModel(BadgeDto.name) private badgeModel: Model<BadgeDto>,
  ) {}

  async getUserBadge(accountId: string): Promise<BadgeDto | null> {
    return await this.badgeModel.findOne({ accountId }).exec()
  }

  async createBadge(accountId: string): Promise<BadgeDto> {
    return await this.badgeModel.create({ accountId })
  }
}
