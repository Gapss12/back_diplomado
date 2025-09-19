import { ValueObject } from "@shared/domain/ValueObject"
import { Result } from "@shared/domain/Result"

interface PhoneNumberProps {
  value: number
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  private constructor(props: PhoneNumberProps) {
    super(props)
  }

  get value(): number {
    return this.props.value
  }

  private static isValidPhoneNumber(phoneNumber: number): boolean {
    // Validación simple: número positivo
    return phoneNumber > 0
  }

  public static create(phoneNumber: number): Result<PhoneNumber> {
    if (!this.isValidPhoneNumber(phoneNumber)) {
      return Result.fail<PhoneNumber>("El número de teléfono no es válido")
    }
    return Result.ok<PhoneNumber>(new PhoneNumber({ value: phoneNumber }))
  }
}