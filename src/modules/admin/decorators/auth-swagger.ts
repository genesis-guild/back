import { UseGuards, applyDecorators } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { JwtAuthGuard } from '../guards/jwt-auth.guard'

export function AuthSwagger(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth())
}
