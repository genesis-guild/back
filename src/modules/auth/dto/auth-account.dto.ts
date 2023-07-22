import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

@Schema({
  collection: 'auth-accounts',
})
export class AuthAccountDto {
  @ApiProperty()
  @Prop()
  hash: string

  @ApiProperty()
  @Prop()
  rt: string
}

export const AuthAccountSchema = SchemaFactory.createForClass(AuthAccountDto)
export type AuthAccountDocument = AuthAccountDto & Document
