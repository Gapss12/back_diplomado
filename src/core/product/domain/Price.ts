import { ValueObject } from "@shared/domain/ValueObject"
import { Result } from "@shared/domain/Result"

interface PriceProps {
  value: number
}

export class Price extends ValueObject<PriceProps> {
  private constructor(props: PriceProps) {
    super(props)
  }

  get value(): number {
    return this.props.value
  }

  private static isValidPrice(price: number): boolean {
    return price >= 0
  }

  public static create(price: number): Result<Price> {
    if (!this.isValidPrice(price)) {
      return Result.fail<Price>("El precio no puede ser negativo")
    }
    return Result.ok<Price>(new Price({ value: price }))
  }
}
