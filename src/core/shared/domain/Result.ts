export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private error?: string;
  private _value?: T;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
  }

  public getValue(): T {
    if (!this.isSuccess || this._value === undefined) {
      throw new Error("No se puede obtener el valor de un resultado fallido");
    }
    return this._value;
  }

  public getError(): string {
    if (this.isSuccess || this.error === undefined) {
      throw new Error("No se puede obtener el error de un resultado exitoso");
    }
    return this.error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }
}
