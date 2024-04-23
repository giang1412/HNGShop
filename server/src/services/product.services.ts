import { ProductReqBody } from '~/models/requests/Product.requests'
import databaseService from './database.services'
import Product from '~/models/schemas/Product.schema'
import { ObjectId, WithId } from 'mongodb'
import { deleteImageFromS3 } from '~/utils/s3'

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

      if ((existingProduct.images as string[]).length >= 6) {
        throw new Error('Exceeded the maximum number of images')
      }

      const product = await databaseService.products.findOneAndUpdate(
        { _id: new ObjectId(product_id) },
        { $push: { images: { $each: urls } } },
        { returnDocument: 'after' }
      )

      return product
    }
  }

  async deleteImageFromProduct({ product_id, image_url }: { product_id: string; image_url: string }) {
    const product = await databaseService.products.findOne({ _id: new ObjectId(product_id) })
    if (!product) {
      throw new Error(' not found')
    }
    if (!image_url) {
      throw new Error('Image not found')
    }

    const path = image_url.split('hngshop.s3.ap-southeast-1.amazonaws.com/')[1]
    await deleteImageFromS3(path)

    if (product.image === image_url) {
      // Xóa ảnh chính và cập nhật trường image và images
      const images = product.images ? product.images.filter((image) => image !== image_url) : []
      const newImage = images.length > 0 ? images[0] : ''
      await databaseService.products.updateOne({ _id: product._id }, { $set: { image: newImage, images } })
    } else {
      // Xóa ảnh khỏi trường images
      const images = product.images ? product.images.filter((image) => image !== image_url) : []
      await databaseService.products.updateOne({ _id: product._id }, { $set: { images } })
    }

    const updatedProduct = await databaseService.products.findOne({ _id: new ObjectId(product_id) })
    return updatedProduct
  }
}
const productService = new ProductService()
export default productService
