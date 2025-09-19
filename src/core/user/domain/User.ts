import { AggregateRoot } from "../../shared/domain/AggregateRoot"
import type { UniqueEntityID } from "../../shared/domain/UniqueEntityID"
import type { UserEmail } from "./UserEmail"
import { UserPassword } from "./UserPassword"
import { Result } from "../../shared/domain/Result"
import { UserCreatedEvent } from "./events/UserCreatedEvent"

interface UserProps {
  email: UserEmail
  password: UserPassword
  createdAt: Date
  updatedAt: Date
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get email(): UserEmail {
    return this.props.email
  }

  get password(): UserPassword {
    return this.props.password
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  public updateEmail(email: UserEmail): void {
    this.props.email = email
    this.props.updatedAt = new Date()
  }

  public async updatePassword(password: UserPassword): Promise<void> {
    if (!password.isHashed()) {
      const hashedPassword = await UserPassword.hashPassword(password.value)
      this.props.password = UserPassword.create(hashedPassword, true).getValue()
    } else {
      this.props.password = password
    }
    this.props.updatedAt = new Date()
  }

  public static create(email: UserEmail, password: UserPassword, id?: UniqueEntityID): Result<User> {
    const user = new User(
      {
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    const isNewUser = !id
    if (isNewUser) {
      user.addDomainEvent(new UserCreatedEvent(user.id))
    }

    return Result.ok<User>(user)
  }
}
