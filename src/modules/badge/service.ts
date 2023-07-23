import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { BadgeDto } from './dto/badge.dto'

@Injectable()
export class BadgeService {
  constructor(
    @InjectModel(BadgeDto.name) private badgeModel: Model<BadgeDto>,
  ) {}

  async getUserBadge(address: string): Promise<BadgeDto | null> {
    return await this.badgeModel.findOne({ address }).exec()
  }

  async createBadge(address: string): Promise<BadgeDto> {
    return await this.badgeModel.create({ address })
  }
}
