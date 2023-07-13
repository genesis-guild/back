import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { ETH_MARKETPLACE_FEE } from 'shared/consts/chain'
import { Socket } from 'socket.io'

import { ChainService } from '../service'
import { ListDto } from '../shared/dto/list.dto'
import { AuthService } from '../shared/services/authService'
import { AccountWS, ChainType, EventNamePostfix } from '../shared/types'
import { createMessageHash } from '../shared/utils/createMessageHash'
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
    private authService: AuthService,
  ) {}

  @SubscribeMessage(enf.events.MINT)
  async mintRentable(client: Socket, data: [string]): Promise<void> {
    const [accountId] = data

    if (!accountId) return

    const mintAbi = (await this.chainService.getService(accountId)).getMintAbi()

    this.emitters.signTransaction(client, {
      from: accountId,
      to: process.env.ETH_RENTABLE_CONTRACT!,
      data: mintAbi,
    })
  }

  @SubscribeMessage(enf.events.LIST)
  async list(client: Socket, data: [string, ListDto]): Promise<void> {
    const [accountId, listDto] = data

    const service = await this.chainService.getService(accountId)
    const listAbi = service.getListAbi(listDto)

    this.emitters.signTransaction(client, {
      from: accountId,
      to: process.env.ETH_MARKETPLACE_CONTRACT!,
      data: listAbi,
      value: ETH_MARKETPLACE_FEE,
    })
  }

  @SubscribeMessage(enf.events.LOGIN)
  async login(client: Socket, account: AccountWS): Promise<void> {
    const { accountId, chainType } = account

    await this.authService.login(accountId, chainType)
    this.emitters.login(client, account)

    this.emitters.signMessage(client, createMessageHash(account))
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

    this.authService.merge(currAccountId, {
      accountId: newAccountId,
      chainType: ChainType.ETH,
    })
  }

  @SubscribeMessage(enf.events.VERIFY_MESSAGE)
  async verifyMessage(
    client: Socket,
    { signature, account }: { signature: Uint8Array; account: AccountWS },
  ): Promise<void> {
    const service = await this.chainService.getService(account.accountId)

    // TODO: JWT token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isVerified = await service.verifyMessage(signature, account)
  }
}
