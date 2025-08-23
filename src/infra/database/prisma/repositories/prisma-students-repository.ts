import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string) {
    const Student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!Student) return null

    return PrismaStudentMapper.toDomain(Student)
  }

  async create(student: Student) {
    const data = PrismaStudentMapper.toPrisma(student)
    await this.prisma.user.create({
      data,
    })
  }
}
