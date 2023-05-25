import { ChainEventName, EventNamePostfix } from '../types'

export class EventNameFactory {
  events: Record<keyof typeof ChainEventName, string>
  constructor(postfix: EventNamePostfix) {
    this.events = Object.keys(ChainEventName).reduce<Record<keyof typeof ChainEventName, string>>(
      (acc, key: ChainEventName) => {
        acc[key] = `${ChainEventName[key]}__${postfix}`

        return acc
      },
      {},
    )
  }
}
