import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { GameDto } from 'shared/dto/game.dto'

import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(GameDto.name) private gamesModel: Model<GameDto>,
    private readonly jwtService: JwtService,
  ) {}

  auth({ username, password }: AuthDto): string {
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSOWORD
    ) {
      throw new HttpException(
        'Wrong password or username',
        HttpStatus.UNAUTHORIZED,
      )
    }

    return this.jwtService.sign({ username })
  }

  async getGames(): Promise<GameDto[]> {
    return await this.gamesModel.find().exec()
  }

  async addGame(gameDto: GameDto): Promise<GameDto> {
    return await this.gamesModel.create(gameDto)
  }
}
