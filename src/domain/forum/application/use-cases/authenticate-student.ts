import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '../repositories/students-repository'
import { HashComparer } from '../crytography/hash-comparer'
import { Encrypter } from '../crytography/encrypter'
import { WrongCredentialErrors } from './errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialErrors,
  {
    accessToken: string
  }
>
@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const findStudent = await this.studentsRepository.findByEmail(email)

    if (!findStudent) {
      return left(new WrongCredentialErrors())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      findStudent.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialErrors())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: findStudent.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
