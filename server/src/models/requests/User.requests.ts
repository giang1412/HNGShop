import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ParamsDictionary } from 'express-serve-static-core'

export interface TokenPayload extends JwtPayload {
  user_id: string
  email: string
  roles: string[]
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  address?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface AddUserReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth?: string
  address?: string
  phone: string
  roles: string[]
  avatar: string
}
