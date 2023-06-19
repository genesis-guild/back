import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

import { ChainService } from '../service'
import { AuthService } from '../shared/services/authService'
import { ChainType, EventNamePostfix } from '../shared/types'
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
  async mintRentable(client: Socket, accountId: string): Promise<void> {
    if (!accountId) return

    const mintAbi = (await this.chainService.getService(accountId)).getMintAbi()

    this.emitters.signTransaction(client, {
      from: accountId,
      to: process.env.ETH_RENTABLE_CONTRACT!,
      data: mintAbi,
    })
  }

  @SubscribeMessage(enf.events.LIST)
  list(): void {
    return
  }

  @SubscribeMessage(enf.events.LOGIN)
  login(client: Socket, accountId: string): void {
    this.authService.login(accountId, ChainType.ETH)
  }

  @SubscribeMessage(enf.events.MERGE)
  merge(client: Socket, data: string[]): void {
    const [currAccountId, newAccountId] = data

    this.authService.merge(currAccountId, {
      accountId: newAccountId,
      chainType: ChainType.ETH,
    })
  }
}
