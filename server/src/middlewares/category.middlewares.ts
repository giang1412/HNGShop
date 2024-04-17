import { checkSchema } from 'express-validator'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validations'

export const addCategoryValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: CATEGORY_MESSAGES.NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: CATEGORY_MESSAGES.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: CATEGORY_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        },
        custom: {
          options: async (value: string, { req }) => {
            const cateInDB = await databaseService.categories.findOne({ name: value })
            if (cateInDB) {
              throw Error(CATEGORY_MESSAGES.CATEGORY_IS_EXIST)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
