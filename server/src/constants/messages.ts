export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  REGISTER_SUCCESS: 'Register success',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',

  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  LOGOUT_SUCCESS: 'Logout success',
  GMAIL_NOT_VERIFIED: 'Gmail is not verified',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  GET_MY_PROFILE_SUCCESS: 'Get my profile success',
  USER_NOT_VERIFIED: 'User not verified',
  BIO_MUST_BE_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio length must be from 1 to 200',
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location length must be from 1 to 200',
  WEBSITE_MUST_BE_STRING: 'Website must be a string',
  WEBSITE_LENGTH: 'Website length must be from 1 to 200',
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers, underscores, not only numbers',
  IMAGE_URL_MUST_BE_STRING: 'Avatar must be a string',
  IMAGE_URL_LENGTH: 'Avatar length must be from 1 to 200',
  UPDATE_ME_SUCCESS: 'Update my profile success',
  GET_PROFILE_SUCCESS: 'Get profile success',
  PHONE_NUMBER_INVALID: 'Phone number invalid',
  PHONE_NUMBER_EXISTED: 'Phone number is existed',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  ACCOUNT_NOT_ADMIN: 'Account not authorized as admin.',
  GET_USERS_SUCCESS: 'Get users success',
  ADD_USER_SUCCESS: 'Add user success',
  UPDATE_USER_SUCCESS: 'Update user success',
  GET_USER_SUCCESS: 'Get user success',
  INVALID_USER_ID: 'User_id is invalid',
  DELETE_USER_SUCCESS: 'Delete user success'
}

export const CATEGORY_MESSAGES = {
  NAME_IS_REQUIRED: 'Name is required',
  CATEGORY_IS_EXIST: 'Category is exist',
  ADD_CATEGORY_SUCCESS: 'Add category success',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  GET_CATEGORIES_SUCCESS: 'Get categories success',
  GET_CATEGORY_SUCCESS: 'Get category success',
  INVALID_CATEGORY_ID: 'Invalid category id',
  CATEGORY_NOT_FOUND: 'Category not found',
  UPDATE_CATEGORY_SUCCESS: 'Update category success',
  DELETE_CATEGORY_SUCCESS: 'Delete category success'
}

export const PRODUCT_MESSAGES = {
  INVALID_PRODUCT_ID: 'Invalid product id',
  PRODUCT_NOT_FOUND: 'Product not found'
}

export const IMAGE_MESSAGES = {
  IMAGE_NOT_FOUND: 'Image not found',
  ADD_IMAGE_SUCCESS: 'Add image success',
  REMOVE_IMAGE_SUCCESS: 'Remove image success'
}
