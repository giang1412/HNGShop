import { ObjectId, WithId } from 'mongodb'
import databaseService from './database.services'
import Category from '~/models/schemas/Category.schema'

class CategoryService {
  async addCategory(name: string) {
    const result = await databaseService.categories.insertOne(
      new Category({
        name
      })
    )
    const cate = await databaseService.categories.findOne({ _id: result.insertedId })
    return cate
  }

  async getCategories() {
    const categories = await databaseService.categories.find({}).toArray()
    return categories
  }

  async getCategory(category_id: string) {
    const category = await databaseService.categories
      .find({
        _id: new ObjectId(category_id)
      })
      .toArray()

    return category[0]
  }
}

const categoryService = new CategoryService()
export default categoryService
