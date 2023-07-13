import { WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

import {
  AccountWS,
  ChainType,
  EventNamePostfix,
  TransactionReqParamsType,
} from '../shared/types'
import { EventNameFactory } from '../shared/utils/event-name-factory'

const enf = new EventNameFactory(EventNamePostfix.EMITTER_POSTFIX)

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class EmitterSockets {
  signTransaction(client: Socket, reqParams: TransactionReqParamsType): void {
    client.emit(enf.events.SIGN_TRANSACTION, ChainType.ETH, reqParams)
  }

  signMessage(client: Socket, message: string): void {
    client.emit(enf.events.SIGN_MESSAGE, message)
  }

  login(client: Socket, account: AccountWS): void {
    client.emit(enf.events.LOGIN, account)
  }
}
