import { HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

import { AuthService } from 'modules/auth'

import { ChainType } from 'shared/types'
import { createAccountHash } from 'shared/utils'

import { ChainService } from '../service'
import { AccountGuard } from '../shared/decorators/auth.guards'
import { ListDto } from '../shared/dto/list.dto'
import { AuthService as ChainAuthService } from '../shared/services/authService'
import { Data, EventNamePostfix } from '../shared/types'
import { EventNameFactory } from '../shared/utils/event-name-factory'
import { EmitterSockets } from './emitters'

const enf = new EventNameFactory(EventNamePostfix.HANDLER_POSTFIX)

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class HandlerSockets {
  constructor(
    private emitters: EmitterSockets,
    private chainService: ChainService,
    private chainAuthService: ChainAuthService,
    private authService: AuthService,
  ) {}

  @SubscribeMessage(enf.events.LIST)
  // TODO: list
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async list(client: Socket, data: [string, ListDto]): Promise<void> {
    // const [address, listDto] = data
    // const service = await this.chainService.getService(address)
    // const listAbi = service?.getListAbi(listDto)
    // this.emitters.signTransaction(client, {
    //   from: address,
    //   to: process.env.ETH_MARKETPLACE_CONTRACT!,
    //   data: listAbi,
    //   value: ETH_MARKETPLACE_FEE,
    // })
  }

  @SubscribeMessage(enf.events.LOGIN)
  @UseGuards(AccountGuard)
  async login(client: Socket, { auth }: Data): Promise<void> {
    await this.chainAuthService.login(auth.account)

    const isAtVerified = this.authService.verifyAT(auth)

    if (!isAtVerified) {
      this.emitters.signMessage(client, createAccountHash(auth.account))
    }
  }

  @SubscribeMessage(enf.events.MERGE)
  merge(
    client: Socket,
    data: {
      currAccountId: string
      newAccountId: string
    },
  ): void {
    const { currAccountId, newAccountId } = data

    this.chainAuthService.merge(currAccountId, {
      address: newAccountId,
      chainType: ChainType.ETH,
    })
  }

  @SubscribeMessage(enf.events.VERIFY_MESSAGE)
  @UseGuards(AccountGuard)
  async verifyMessage(
    client: Socket,
    { data: { signature }, auth: { account } }: Data<{ signature: Uint8Array }>,
  ): Promise<void> {
    const service = this.chainService.getService(account.chainType)
    const isVerified = await service.verifyMessage(signature, account)

    if (!isVerified) {
      throw new HttpException('Wrong signature', HttpStatus.UNAUTHORIZED)
    }
    const tokens = await this.authService.generateTokens(
      createAccountHash(account),
    )

    this.emitters.tokens(client, tokens, account)
  }
}
