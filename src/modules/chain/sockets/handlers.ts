import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

import { AuthService } from 'modules/auth'

import { Account, ChainType } from 'shared/types'
import { createAccountHash } from 'shared/utils'

import { ChainService } from '../service'
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
  async login(client: Socket, { data }: Data<Account>): Promise<void> {
    await this.chainAuthService.login(data)

    this.emitters.signMessage(client, createAccountHash(data))
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
  async verifyMessage(
    client: Socket,
    {
      data: { signature, account },
    }: Data<{ signature: Uint8Array; account: Account }>,
  ): Promise<void> {
    const service = this.chainService.getService(account.chainType)

    const isVerified = await service.verifyMessage(signature, account)

    if (!isVerified) return

    const tokens = await this.authService.generateTokens(
      createAccountHash(account),
    )

    this.emitters.tokens(client, tokens, account)
  }
}
