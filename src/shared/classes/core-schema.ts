import { Exclude } from 'class-transformer'

export class CoreSchema {
  // If i want to use _id somewhere
  // @Transform(({ value }) => value.toString())
  @Exclude()
  _id: string

  @Exclude()
  __v: number
}
