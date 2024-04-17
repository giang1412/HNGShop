import { NextFunction, Request, Response } from 'express'
import { CategoryNameReqBody } from '~/models/requests/Category.requests'
import categoryService from '~/services/category.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { CATEGORY_MESSAGES } from '~/constants/messages'

export const addCategoryController = async (
  req: Request<ParamsDictionary, any, CategoryNameReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body
  const result = await categoryService.addCategory(name)
  return res.json({
    message: CATEGORY_MESSAGES.ADD_CATEGORY_SUCCESS,
    result: result
  })
}
