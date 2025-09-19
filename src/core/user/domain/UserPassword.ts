import { ValueObject } from "../../shared/domain/ValueObject"
import { Result } from "../../shared/domain/Result"
import * as bcrypt from "bcrypt"

interface UserPasswordProps {
  value: string
  hashed: boolean
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  private constructor(props: UserPasswordProps) {
    super(props)
  }

  get value(): string {
    return this.props.value
  }

  public isHashed(): boolean {
    return this.props.hashed
  }

  private static isValidPassword(password: string): boolean {
    // Al menos 8 caracteres, una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  public static create(password: string, hashed = false): Result<UserPassword> {
    if (!hashed && (!password || !this.isValidPassword(password))) {
      return Result.fail<UserPassword>(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
      )
    }
    return Result.ok<UserPassword>(new UserPassword({ value: password, hashed }))
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    if (this.isHashed()) {
      return await bcrypt.compare(plainTextPassword, this.props.value)
    }
    return this.props.value === plainTextPassword
  }

  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }
}
