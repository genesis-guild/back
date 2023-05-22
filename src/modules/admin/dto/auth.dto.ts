import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

@Schema()
export class AuthDto {
  @ApiProperty()
  @Prop()
  username: string

  @ApiProperty()
  @Prop()
  password: string
}
