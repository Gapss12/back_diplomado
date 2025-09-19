import { ValueObject } from "@shared/domain/ValueObject"
import { Result } from "@shared/domain/Result"

interface CustomerNameProps {
  value: string
}

export class CustomerName extends ValueObject<CustomerNameProps> {
  private constructor(props: CustomerNameProps) {
    super(props)
  }

  get value(): string {
    return this.props.value
  }

  private static isValidName(name: string): boolean {
    return name.length >= 3
  }

  public static create(name: string): Result<CustomerName> {
    if (!name || !this.isValidName(name)) {
      return Result.fail<CustomerName>("El nombre del cliente debe tener al menos 3 caracteres")
    }
    return Result.ok<CustomerName>(new CustomerName({ value: name }))
  }
}
