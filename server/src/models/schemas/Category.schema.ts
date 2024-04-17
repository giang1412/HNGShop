import { ObjectId } from 'mongodb'

interface CategoryType {
  _id?: ObjectId
  name: string
}

export default class Category {
  _id?: ObjectId
  name: string
  constructor({ _id, name }: CategoryType) {
    this._id = _id
    this.name = name
  }
}
