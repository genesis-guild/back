import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common'
import { ClassTransformOptions, plainToClass } from 'class-transformer'
import { Document } from 'mongoose'

export const MongooseClassSerializerInterceptor = (
  classToIntercept: Type,
): typeof ClassSerializerInterceptor => {
  return class Interceptor extends ClassSerializerInterceptor {
    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
      return super.serialize(this.prepareResponse(response), options)
    }

    private changePlainObjectToClass(
      document: PlainLiteralObject,
    ): PlainLiteralObject {
      if (!(document instanceof Document)) {
        return document
      }

      return plainToClass(classToIntercept, document.toJSON())
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ): PlainLiteralObject | PlainLiteralObject[] {
      if (Array.isArray(response)) {
        return response.map((d: PlainLiteralObject) =>
          this.changePlainObjectToClass(d),
        )
      }

      return this.changePlainObjectToClass(response)
    }
  }
}
