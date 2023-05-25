import { WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

import {
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
}
