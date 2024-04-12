import { NextFunction, Request, Response } from 'express'
import { UserVerifyStatus } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/User.requests'
import { ErrorWithStatus } from './error.middlewares'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { validate } from '~/utils/validations'
import { ParamSchema, checkSchema } from 'express-validator'
import { REGEX_PHONE_NUMBER } from '~/constants/regex'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { ObjectId } from 'mongodb'
import { confirmPasswordSchema, emailSchema, passwordSchema } from './auth.middlewares'

const userIdSchema: ParamSchema = {
  custom: {
    options: async (value: string, { req }) => {
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.INVALID_USER_ID,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
    }
  }
}
const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
  },
  trim: true,

  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
  }
}
const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
  }
}

const imageSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.IMAGE_URL_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 400
    },
    errorMessage: USERS_MESSAGES.IMAGE_URL_LENGTH
  }
}

export const verifiedUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload
  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        optional: true,
        notEmpty: undefined
      },
      date_of_birth: {
        ...dateOfBirthSchema,
        optional: true
      },
      address: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.LOCATION_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: USERS_MESSAGES.LOCATION_LENGTH
        }
      },
      avatar: imageSchema,
      phone: {
        optional: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!REGEX_PHONE_NUMBER.test(value)) {
              throw new Error(USERS_MESSAGES.PHONE_NUMBER_INVALID)
            }
            const user = await databaseService.users.findOne({ phone: value })
            if (user) {
              throw Error(USERS_MESSAGES.PHONE_NUMBER_EXISTED)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const changePasswordValidator = validate(
  checkSchema({
    old_password: {
      custom: {
        options: async (value, { req }) => {
          const { user_id } = (req as Request).decoded_authorization as TokenPayload
          const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

          if (!user) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.USER_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          const { password } = user
          const isMatch = hashPassword(value) === password

          if (!isMatch) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
        }
      }
    },
    password: passwordSchema,
    confirm_password: confirmPasswordSchema
  })
)

export const addUserValidator = validate(
  checkSchema({
    email: emailSchema,
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    name: nameSchema
  })
)

export const updateUserValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      name: {
        ...nameSchema,
        optional: true,
        notEmpty: undefined
      },
      date_of_birth: {
        ...dateOfBirthSchema,
        optional: true
      },
      address: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.LOCATION_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: USERS_MESSAGES.LOCATION_LENGTH
        }
      },
      avatar: imageSchema,
      phone: {
        optional: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!REGEX_PHONE_NUMBER.test(value)) {
              throw new Error(USERS_MESSAGES.PHONE_NUMBER_INVALID)
            }
            const user = await databaseService.users.findOne({ phone: value })
            if (user) {
              throw Error(USERS_MESSAGES.PHONE_NUMBER_EXISTED)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const getUserValidator = validate(
  checkSchema(
    {
      user_id: userIdSchema
    },
    ['params']
  )
)
