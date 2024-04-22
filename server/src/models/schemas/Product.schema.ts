import { ObjectId } from 'mongodb'

interface ProductType {
  _id?: ObjectId
  name: string
  image?: string
  images?: string[]
  description?: string
  category?: ObjectId
  price?: number
  price_before_discount?: number
  quantity?: number
  sold?: number
  view?: number
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  name: string
  image?: string
  images?: string[]
  description?: string
  category?: ObjectId
  price?: number
  price_before_discount?: number
  quantity?: number
  sold?: number
  view?: number
  created_at?: Date
  updated_at?: Date
  constructor(product: ProductType) {
    this._id = product._id
    this.name = product.name || ''
    this.image = product.image || ''
    this.images = product.images || []
    this.description = product.description || ''
    this.category = product.category
    this.price = product.price || 0
    this.price_before_discount = product.price_before_discount || 0
    this.quantity = product.quantity || 0
    this.sold = product.sold || 0
    this.view = product.view || 0
    this.created_at = product.created_at || new Date()
    this.updated_at = product.updated_at || new Date()
  }
}
