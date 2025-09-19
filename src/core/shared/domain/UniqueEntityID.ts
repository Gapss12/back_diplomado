export class UniqueEntityID {
    private value: string | number
  
    constructor(id?: string | number) {
      this.value = id || this.generateId()
    }
  
    private generateId(): number {
      return Date.now() + Math.floor(Math.random() * 1000)
    }
  
    toString(): string {
      return String(this.value)
    }
  
    toValue(): string | number {
      return this.value
    }
  
    equals(id?: UniqueEntityID): boolean {
      if (id === null || id === undefined) {
        return false
      }
      if (!(id instanceof UniqueEntityID)) {
        return false
      }
      return this.toValue() === id.toValue()
    }

    public setValue(id: string | number): void {
      this.value = id
    }
  }
  