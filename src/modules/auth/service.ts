import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Data } from 'modules/chain/shared/types'

import { REFRESH_TOKEN_EXPIRES } from 'shared/consts'
import { Tokens } from 'shared/types'
import { createAccountHash } from 'shared/utils'

import { AuthAccountDto } from './dto/auth-account.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthAccountDto.name)
    private authAccountModel: Model<AuthAccountDto>,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(rt: string): Promise<Tokens> {
    const tokenPayload = this.jwtService.verify(rt, {
      secret: process.env.JWT_REFRESH,
    })

    if (!tokenPayload) {
      throw new UnauthorizedException()
    }

    const authAccount = await this.authAccountModel
      .findOne({ hash: tokenPayload.hash })
      .exec()

    if (authAccount?.rt !== rt) {
      throw new UnauthorizedException()
    }

    const tokens = await this.generateTokens(authAccount.hash)

    return tokens
  }

  verifyAT(auth: Data['auth']): boolean {
    if (!auth.at) return false

    try {
      const sign = this.jwtService.verify<{ hash: string }>(auth.at)

      return sign.hash === createAccountHash(auth.account)
    } catch (e) {
      return false
    }
  }

  async generateTokens(hash: string): Promise<Tokens> {
    const tokens = {
      at: this.jwtService.sign({ hash }),
      rt: this.jwtService.sign(
        { hash },
        {
          secret: process.env.JWT_REFRESH,
          expiresIn: REFRESH_TOKEN_EXPIRES,
        },
      ),
    }

    const authAccount = await this.authAccountModel.findOne({ hash }).exec()

    if (authAccount) {
      this.authAccountModel.updateOne(
        { hash },
        {
          rt: tokens.rt,
        },
      )
    }

    if (!authAccount) {
      await this.authAccountModel.create({
        hash,
        rt: tokens.rt,
      })
    }

    return tokens
  }
}
