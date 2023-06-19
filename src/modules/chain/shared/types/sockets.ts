export const ChainEventName = {
  MINT: 'mint',
  SIGN_TRANSACTION: 'sign_transaction',
  LIST: 'list',
  LOGIN: 'login',
  MERGE: 'merge',
} as const
export type ChainEventName =
  (typeof ChainEventName)[keyof typeof ChainEventName]

export enum EventNamePostfix {
  HANDLER_POSTFIX = 'server',
  EMITTER_POSTFIX = 'client',
}
