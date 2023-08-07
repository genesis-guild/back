export const HeaderKey = {
  Account: 'account',
  Asd: 'asd',
} as const
export type HeaderKey = (typeof HeaderKey)[keyof typeof HeaderKey]
