import { ObjectId } from 'mongodb'
import { ROLE, UserVerifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  email: string
  name?: string
  password: string

  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus

  date_of_birth?: Date
  address?: string
  phone?: string
  roles: string[]
  avatar?: string

  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  email: string
  name?: string
  password: string
  email_verify_token: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  date_of_birth?: Date
  address?: string
  phone?: string
  roles: string[]
  avatar?: string

  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    const date = new Date()

    this._id = user._id
    this.email = user.email
    this.name = user.name || ''
    this.password = user.password
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.date_of_birth = user.date_of_birth || date
    this.address = user.address || ''
    this.phone = user.phone || ''
    this.roles = user.roles || ROLE.USER
    this.avatar = user.avatar || ''
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
