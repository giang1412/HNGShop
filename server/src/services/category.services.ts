import { ObjectId, WithId } from 'mongodb'
import databaseService from './database.services'
import Category from '~/models/schemas/Category.schema'
import { CategoryNameReqBody } from '~/models/requests/Category.requests'

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
}

const categoryService = new CategoryService()
export default categoryService
