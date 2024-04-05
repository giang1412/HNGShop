import { ObjectId } from 'mongodb'
import { ROLE, TokenType, UserVerifyStatus } from '~/constants/enums'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { signToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.services'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { config } from 'dotenv'
config()

class AuthService {
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
  private signAccessToken({ user_id, verify, roles }: { user_id: string; verify: UserVerifyStatus; roles: string[] }) {
    return signToken({
      payload: {
        user_id,
        roles,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken({
    user_id,
    verify,
    exp,
    roles
  }: {
    user_id: string
    verify: UserVerifyStatus
    exp?: number
    roles: string[]
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          roles,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private signAccessTokenAndRefreshToken({
    user_id,
    verify,
    roles
  }: {
    user_id: string
    verify: UserVerifyStatus
    roles: string[]
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify, roles }),
      this.signRefreshToken({ user_id, verify, roles })
    ])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    roles,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    roles: string[]
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, roles }),
      this.signRefreshToken({ user_id, verify, exp, roles }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])
    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        iat: decoded_refresh_token.iat,
        exp: decoded_refresh_token.exp,
        roles: decoded_refresh_token.roles
      })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      roles: [ROLE.USER]
    })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        name: `user${user_id.toString()}`,
        password: hashPassword(payload.password),
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        roles: [ROLE.USER]
      })
    )

    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      roles: [ROLE.USER]
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp, roles: [ROLE.USER] })
    )
    console.log('email_verify_token: ', email_verify_token)
    return {
      access_token,
      refresh_token
    }
  }
}

const authService = new AuthService()
export default authService
