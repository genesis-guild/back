import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import { HeaderKey } from 'shared/types'

export const ExecuteHeaders = createParamDecorator(
  (headerKey: HeaderKey, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    let header = req.headers[headerKey]

    if (headerKey === HeaderKey.Account && header) {
      const [chainType, address] = header.split(':')

      header = {
        chainType,
        address,
      }
    }

    return header
  },
)
