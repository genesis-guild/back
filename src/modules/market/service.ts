import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { ListItemDto } from './dto/list-item.dto'

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(ListItemDto.name) private listModel: Model<ListItemDto>,
  ) {}

  getAllListings(): string {
    return 'getAllListed'
  }

  list(): void {
    return
  }

  unList(): void {
    return
  }
}
