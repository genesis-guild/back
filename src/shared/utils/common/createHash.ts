import * as crypto from 'crypto'

export const createHash = (data: unknown): string => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
}
