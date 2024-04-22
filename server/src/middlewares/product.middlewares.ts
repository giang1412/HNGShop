import { validate } from '~/utils/validations'
import { checkSchema } from 'express-validator'
import { PRODUCT_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from './error.middlewares'
import HTTP_STATUS from '~/constants/httpStatus'

export const productIdValidator = validate(
  checkSchema({
    product_id: {
      notEmpty: {
        errorMessage: PRODUCT_MESSAGES.INVALID_PRODUCT_ID
      },
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              message: PRODUCT_MESSAGES.INVALID_PRODUCT_ID,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          const productInDB = await databaseService.products.findOne({ _id: new ObjectId(value) })
          if (productInDB == null) {
            throw new ErrorWithStatus({
              message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)
