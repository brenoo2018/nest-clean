import { HashComparer } from '@/domain/forum/application/crytography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/crytography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
