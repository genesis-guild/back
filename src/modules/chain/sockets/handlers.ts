import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { ETH_MARKETPLACE_FEE } from 'shared/consts/chain'
import { Socket } from 'socket.io'

import { ChainService } from '../service'
import { ListDto } from '../shared/dto/list.dto'
import { EventNamePostfix } from '../shared/types'
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
}
