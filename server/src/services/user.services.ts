import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { AddUserReqBody, UpdateMeReqBody, UpdateUserReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { USERS_MESSAGES } from '~/constants/messages'
import User from '~/models/schemas/User.schema'
import { ROLE, TokenType, UserVerifyStatus } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import { ErrorWithStatus } from '~/middlewares/error.middlewares'
import HTTP_STATUS from '~/constants/httpStatus'

class UserService {
  private signEmailVerifyToken({
    user_id,
    verify,
    roles
  }: {
    user_id: string
    verify: UserVerifyStatus
    roles: string[]
  }) {
    return signToken({
      payload: {
        user_id,
        roles,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async changePassword(user_id: string, new_password: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashPassword(new_password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
    }
  }

  async getUsers(user_id: string) {
    const users = await databaseService.users
      .find(
        { _id: { $ne: new ObjectId(user_id) } },
        { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
      )
      .toArray()
    return users
  }

  async getUser(user_id: string) {
    const user = await databaseService.users
      .find({ _id: new ObjectId(user_id) }, { projection: { password: 0 } })
      .toArray()
    return user
  }

  async addUser(payload: AddUserReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      roles: [ROLE.USER]
    })
    const date = new Date()
    const insertedUser = new User({
      ...payload,
      _id: user_id,
      email_verify_token,
      date_of_birth: date,
      password: hashPassword(payload.password),
      name: payload.name || `user${user_id.toString()}`,
      roles: [ROLE.USER]
    })
    await databaseService.users.insertOne(insertedUser)

    console.log('email_verify_token', email_verify_token)
    // Trả về user vừa được chèn vào cơ sở dữ liệu
    const user = await databaseService.users.findOne(
      { _id: user_id },
      {
        projection: {
          password: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateUser(user_id: string, payload: UpdateUserReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateUserReqBody & { date_of_birth?: Date }),
          password: hashPassword(_payload.password as string)
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
}

const userService = new UserService()
export default userService
