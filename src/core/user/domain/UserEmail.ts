import { ValueObject } from "../../shared/domain/ValueObject"
import { Result } from "../../shared/domain/Result"

interface UserEmailProps {
  value: string
}

export class UserEmail extends ValueObject<UserEmailProps> {
  private constructor(props: UserEmailProps) {
    super(props)
  }

  get value(): string {
    return this.props.value
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public static create(email: string): Result<UserEmail> {
    if (!email || !this.isValidEmail(email)) {
      return Result.fail<UserEmail>("El email no es válido")
    }
    return Result.ok<UserEmail>(new UserEmail({ value: email }))
  }
}
