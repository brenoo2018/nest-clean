import { DomainEvents } from '@/core/events/domain-events'
// import { HashGenerator } from '@/domain/forum/application/crytography/hash-generator'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  // constructor(
  //   private studentsRepository: StudentsRepository,
  //   private hashGenerator: HashGenerator,
  // ) {}

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email === email)

    if (!student) {
      return null
    }

    return student
  }

  async create(Student: Student) {
    this.items.push(Student)

    DomainEvents.dispatchEventsForAggregate(Student.id)
  }
}
