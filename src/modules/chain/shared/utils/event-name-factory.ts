import { ChainEventName, EventNamePostfix } from '../types'

export class EventNameFactory {
  events: Record<keyof typeof ChainEventName, string>
  constructor(postfix: EventNamePostfix) {
    this.events = Object.keys(ChainEventName).reduce(
      (acc, key: ChainEventName) => {
        acc[key] = `${ChainEventName[key]}__${postfix}`

        return acc
      },
      {} as Record<keyof typeof ChainEventName, string>,
    )
  }
}
