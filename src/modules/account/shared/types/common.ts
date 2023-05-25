export const AccountType = {
  LENDER: 'lender',
  BORROWER: 'borrower',
} as const
export type AccountType = (typeof AccountType)[keyof typeof AccountType]
