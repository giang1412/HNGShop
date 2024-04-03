import { ObjectId } from 'mongodb'
import { ROLE } from '~/constants/enum'

interface UserType {
  _id?: ObjectId
  email: string
  name?: string
  password: string
  date_of_birth?: Date
  address?: string
  phone?: string
  roles: string[]
  avatar?: string
}

export default class User {
  _id?: ObjectId
  email: string
  name?: string
  password: string
  date_of_birth?: Date
  address?: string
  phone?: string
  roles: string[]
  avatar?: string

  constructor(user: UserType) {
    const date = new Date()

    this._id = user._id
    this.email = user.email
    this.name = user.name || ''
    this.password = user.password
    this.date_of_birth = user.date_of_birth || date
    this.address = user.address || ''
    this.phone = user.phone || ''
    this.roles = user.roles || ROLE.USER
    this.avatar = user.avatar || ''
  }
}
