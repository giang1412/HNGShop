import { ObjectId } from 'mongodb'

export interface ProductReqBody {
  name: string
  description?: string
  category?: string
  price?: number
  price_before_discount?: number
  quantity?: number
}
