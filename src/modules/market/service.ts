import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { AdminService } from 'modules/admin'

import { NftDto } from 'shared/dto/nft.dto'
import { createHash } from 'shared/utils'

import { ListItemDto } from './dto/list-item.dto'

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(ListItemDto.name) private listModel: Model<ListItemDto>,
    private adminService: AdminService,
  ) {}

  async getAllListings(): Promise<ListItemDto[]> {
    return await this.listModel.find().populate('game').exec()
  }

  getNftHash(nftDto: NftDto): string {
    return createHash({
      tokenId: nftDto.tokenId,
      nftContract: nftDto.contract.address.toLowerCase(),
    })
  }

  async canList(nftDto: NftDto): Promise<boolean> {
    const hash = createHash({
      tokenId: nftDto.tokenId,
      nftContract: nftDto.contract.address.toLowerCase(),
    })
    const listItem = await this.listModel.findOne({ hash })

    return !listItem
  }

  async list(nftDto: NftDto): Promise<void> {
    const game = await this.adminService.getGame(nftDto.contract.address)
    const hash = createHash({
      tokenId: nftDto.tokenId,
      nftContract: nftDto.contract.address.toLowerCase(),
    })

    if (!(await this.canList(nftDto))) {
      throw new HttpException('Nft is already listed!', HttpStatus.BAD_REQUEST)
    }

    this.listModel.create({
      nft: nftDto,
      game,
      distribution: 30,
      hash,
    })
  }

  unList(): void {
    return
  }
}
