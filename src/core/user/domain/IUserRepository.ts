import type { User } from "./User"
import type { UserEmail } from "./UserEmail"

export interface IUserRepository {
  findById(id: number | string): Promise<User | null>
  findByEmail(email: UserEmail): Promise<User | null>
  save(user: User): Promise<void>
  findAll(): Promise<User[]>
  delete(id: number | string): Promise<void>
  exists(email: UserEmail): Promise<boolean>
}
