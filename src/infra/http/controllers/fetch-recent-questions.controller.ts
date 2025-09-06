import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private useCase: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryPageValidationPipe) page: PageQueryParamsSchema,
  ) {
    const result = await this.useCase.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value?.questions

    return {
      questions: questions?.map((question) =>
        QuestionPresenter.toHTTP(question),
      ),
    }
  }
}
