import { validate } from '~/utils/validations'
import { checkSchema } from 'express-validator'
import { IMAGE_MESSAGES, PRODUCT_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from './error.middlewares'
import HTTP_STATUS from '~/constants/httpStatus'

export const productIdValidator = validate(
  checkSchema(
    {
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
    },
    ['params', 'body']
  )
)

export const imageUrlValidator = validate(
  checkSchema(
    {
      image_url: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.INVALID_PRODUCT_ID
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const image = await databaseService.products.findOne({ images: value })
            if (image == null) {
              throw new ErrorWithStatus({
                message: IMAGE_MESSAGES.IMAGE_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateProductValidator = validate(
  checkSchema({
    name: {
      isString: {
        errorMessage: PRODUCT_MESSAGES.NAME_MUST_BE_A_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: PRODUCT_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      optional: true
    },
    description: {
      optional: true,
      isString: {
        errorMessage: PRODUCT_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
      },
      trim: true
    },
    price: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_A_NUMBER
      }
    },
    price_before_discount: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_A_NUMBER
      }
    },
    quantity: {
      optional: true,
      isNumeric: {
        errorMessage: PRODUCT_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
      }
    },
    category: {
      optional: true,
      isString: {
        errorMessage: PRODUCT_MESSAGES.CATEGORY_MUST_BE_A_STRING
      }
    }
  })
)
