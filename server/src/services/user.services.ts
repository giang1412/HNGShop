import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { AddUserReqBody, UpdateMeReqBody, UpdateUserReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { USERS_MESSAGES } from '~/constants/messages'
import User from '~/models/schemas/User.schema'
import { ROLE, TokenType, UserVerifyStatus } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import path from 'path'
import { getNameFromFullname, handleUploadImage } from '~/utils/file'
import { Request } from 'express'
import { uploadFileToS3 } from '~/utils/s3'
import fsPromise from 'fs/promises'
import { UPLOAD_IMAGE_AVATAR_DIR } from '~/constants/dir'
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

  async deleteUser(user_id: string) {
    await databaseService.users.findOneAndDelete({ _id: new ObjectId(user_id) })
    return {
      message: USERS_MESSAGES.DELETE_USER_SUCCESS
    }
  }

  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_AVATAR_DIR, newFullFilename)
        sharp.cache(false)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const mime = (await import('mime')).default
        const s3Result = await uploadFileToS3({
          filename: 'images/' + newFullFilename,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string
        }
      })
    )
    return result
  }
  async uploadAvatar(user_id: string, url: string) {
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          avatar: url
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        projection: {
          avatar: 1
        },
        returnDocument: 'after'
      }
    )

    return user
  }
}

const userService = new UserService()
export default userService
