import { Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({
  collection: 'listings',
})
export class ListItemDto {}

export const ListItemSchema = SchemaFactory.createForClass(ListItemDto)

export type ListItemDocument = ListItemDto & Document
