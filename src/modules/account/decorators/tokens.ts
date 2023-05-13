import { applyDecorators } from '@nestjs/common'
import { Prop, raw } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

export function Tokens(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiProperty({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          amount: { type: 'number' },
        },
      },
    }),
    Prop([
      raw({
        token: { type: String },
        amount: { type: Number },
      }),
    ]),
  )
}
