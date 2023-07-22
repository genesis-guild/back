import { UseGuards, applyDecorators } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { AdminGuard } from 'shared/guards/auth.guard'

export function AuthSwagger(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(AdminGuard), ApiBearerAuth())
}
