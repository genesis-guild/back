import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UseGuards,
  applyDecorators,
} from '@nestjs/common'
import { Socket } from 'socket.io'

import { AuthService } from 'modules/auth'

import { Account } from 'shared/types'

import { Data } from '../types'

export class AccountGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const args = ctx.getArgs<[Socket, Data]>()
    const [, { auth }] = args

    if (!(auth.account as Account | undefined)) {
      throw new HttpException(
        'auth.account is required',
        HttpStatus.BAD_REQUEST,
      )
    }

    return true
  }
}

export class TokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const args = ctx.getArgs<[Socket, Data]>()
    const [, { auth }] = args

    return this.authService.verifyAT(auth)
  }
}

export function AuthSockets(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(AccountGuard), UseGuards(TokenGuard))
}
