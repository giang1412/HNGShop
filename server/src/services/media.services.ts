import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_AVATAR_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadImage } from '~/utils/file'
import { uploadFileToS3 } from '~/utils/s3'
import fsPromise from 'fs/promises'

class MediaService {
  async uploadImage(req: Request, maxFile: number, folder: string) {
    const files = await handleUploadImage(req, maxFile)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_AVATAR_DIR, newFullFilename)
        sharp.cache(false)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const mime = (await import('mime')).default
        const s3Result = await uploadFileToS3({
          filename: 'images/' + folder + newFullFilename,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string
        }
      })
    )
    return result
  }
}

const mediaService = new MediaService()
export default mediaService
