import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const findUser = await this.prisma.user.findUnique({ where: { email } })

    if (!findUser) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const isPasswordValid = await compare(password, findUser.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const accessToken = this.jwt.sign({ sub: findUser.id })

    return { access_token: accessToken }
  }
}
