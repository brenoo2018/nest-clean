import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

// const createQuestionBodySchema = z.object({
//   email: z.string().email(),
//   password: z.string(),
// })

// type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  @HttpCode(200)
  // @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handle() {
    return 'CreateQuestionController'
  }
}
