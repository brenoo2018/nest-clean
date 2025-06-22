import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value

    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation Failed',
          statusCode: 400,
          errors: error.format(),
        })
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
