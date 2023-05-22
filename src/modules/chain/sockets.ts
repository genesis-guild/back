import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { ETHService } from './ETH/service'
import { ChainType } from './types/common'

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class ChainSockets {
  @WebSocketServer() server: Server

  constructor(private readonly ethService: ETHService) {}

  @SubscribeMessage('mint__server')
  async mintRentable(client: Socket, accountId: string): Promise<void> {
    if (!accountId) return

    client.emit('sign_transaction__client', ChainType.ETH, {
      from: accountId,
      to: process.env.ETH_RENTABLE_CONTRACT,
      data: await this.ethService.getMintAbi(),
    })
  }
}
