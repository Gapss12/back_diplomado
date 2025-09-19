import { UniqueEntityID } from "./UniqueEntityID"

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID
  protected props: T

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id || new UniqueEntityID()
    this.props = props
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false
    }

    if (this === entity) {
      return true
    }

    return this._id.equals(entity._id)
  }

  get id(): UniqueEntityID {
    return this._id
  }
}