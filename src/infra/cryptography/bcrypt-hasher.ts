import { HashComparer } from '@/domain/forum/application/crytography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/crytography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT = 8
  hash(plain: string) {
    return hash(plain, this.HASH_SALT)
  }

  compare(plain: string, hash: string) {
    return compare(plain, hash)
  }
}
