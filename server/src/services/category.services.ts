import { ObjectId, WithId } from 'mongodb'
import databaseService from './database.services'
import Category from '~/models/schemas/Category.schema'
import { after } from 'lodash'

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

  async updateCategory(category_id: string, new_name: string) {
    const category = await databaseService.categories.findOneAndUpdate(
      { _id: new ObjectId(category_id) },
      { $set: { name: new_name } },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return category
  }
}

const categoryService = new CategoryService()
export default categoryService
