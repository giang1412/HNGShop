import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  AddUserReqBody,
  ChangePasswordReqBody,
  TokenPayload,
  UpdateMeReqBody,
  UpdateUserReqBody,
  UserIDReqParams
} from '~/models/requests/User.requests'
import userService from '~/services/user.services'

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await userService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_MY_PROFILE_SUCCESS,
    result
  })
}

export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const body = req.body
  const user = await userService.updateMe(user_id, body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    user
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { password } = req.body
  const result = await userService.changePassword(user_id, password)
  return res.json(result)
}

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await userService.getUsers(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_USERS_SUCCESS,
    result
  })
}

export const getUserController = async (
  req: Request<ParamsDictionary, any, UpdateUserReqBody, UserIDReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.params
  const result = await userService.getUser(user_id)
  if (result.length == 0) {
    return res.json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  return res.json({
    message: USERS_MESSAGES.GET_USER_SUCCESS,
    result
  })
}

export const addUserController = async (
  req: Request<ParamsDictionary, any, AddUserReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.addUser(req.body)
  return res.json({
    message: USERS_MESSAGES.ADD_USER_SUCCESS,
    result
  })
}

export const updateUserController = async (
  req: Request<ParamsDictionary, any, UpdateUserReqBody, UserIDReqParams>,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body
  const { user_id } = req.params
  const result = await userService.updateUser(user_id, payload)
  return res.json({
    message: USERS_MESSAGES.UPDATE_USER_SUCCESS,
    result
  })
}

export const deleteUserController = async (
  req: Request<ParamsDictionary, any, UpdateUserReqBody, UserIDReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.params
  const result = await userService.deleteUser(user_id)
  return res.json(result)
}
