import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { Document, Schema as MSchema } from 'mongoose'
import { CoreSchema } from 'shared/classes'
import { GameDto } from 'shared/dto/game.dto'
import { NftDto } from 'shared/dto/nft.dto'

@Schema({
  collection: 'listings',
})
export class ListItemDto extends CoreSchema {
  @ApiProperty()
  @Prop()
  nft: NftDto

  @ApiProperty()
  @Prop({ type: MSchema.Types.ObjectId, ref: GameDto.name })
  @Type(() => GameDto)
  game: GameDto

  @ApiProperty()
  @Prop()
  distribution: string

  @ApiProperty()
  @Prop()
  hash: string
}

export const ListItemSchema = SchemaFactory.createForClass(ListItemDto)

export type ListItemDocument = ListItemDto & Document
