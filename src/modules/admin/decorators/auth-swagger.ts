import { UseGuards, applyDecorators } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { AdminGuard } from '../guards/admin.guard'

export function AuthSwagger(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(AdminGuard), ApiBearerAuth())
}
