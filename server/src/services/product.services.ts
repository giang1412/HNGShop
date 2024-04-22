import { ProductReqBody } from '~/models/requests/Product.requests'
import databaseService from './database.services'
import Product from '~/models/schemas/Product.schema'
import { ObjectId } from 'mongodb'

class ProductService {
  async checkAndCreateCategory(category: string) {
    const existingCategory = await databaseService.categories.findOne({ name: category })

    if (existingCategory) {
      return existingCategory._id
    } else {
      const result = await databaseService.categories.insertOne({ name: category })
      return result.insertedId
    }
  }

  async addProduct(body: ProductReqBody) {
    const category = body.category
      ? await this.checkAndCreateCategory(body.category as string)
      : await this.checkAndCreateCategory('Other')
    const result = await databaseService.products.insertOne(
      new Product({
        name: body.name,
        description: body.description,
        category,
        price: body.price,
        price_before_discount: body.price_before_discount,
        quantity: body.quantity
      })
    )
    const product = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(result.insertedId)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        }
      ])
      .toArray()
    return product[0]
  }

  async updateProductImage(product_id: string, imageUrl: { url: string }[]) {
    if (imageUrl.length) {
      const existingProduct = await databaseService.products.findOne({ _id: new ObjectId(product_id) })

      if (!existingProduct) {
        throw new Error('Product not found')
      }

      const urls = imageUrl.map((item) => item.url)

      if (!existingProduct.image) {
        await databaseService.products.findOneAndUpdate({ _id: new ObjectId(product_id) }, { $set: { image: urls[0] } })
      }

      const product = await databaseService.products.findOneAndUpdate(
        { _id: new ObjectId(product_id) },
        { $push: { images: { $each: urls, $slice: -6 } } },
        { returnDocument: 'after' }
      )

      return product
    }
  }
}

const productService = new ProductService()
export default productService
