export const ChainEventName = {
  MINT: 'mint',
  SIGN_TRANSACTION: 'sign_transaction',
  LIST: 'list',
  LOGIN: 'login',
  MERGE: 'merge',
  SIGN_MESSAGE: 'sign_message',
  VERIFY_MESSAGE: 'verify_message',
} as const
export type ChainEventName =
  (typeof ChainEventName)[keyof typeof ChainEventName]

export enum EventNamePostfix {
  HANDLER_POSTFIX = 'server',
  EMITTER_POSTFIX = 'client',
}
