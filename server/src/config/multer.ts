import multer, { memoryStorage } from 'multer'

const upload = multer({
    storage: memoryStorage(),
})

export const workspaceUpdateMulterMiddleware = upload.single('picture')

export const userUpdateMulterMiddleware = upload.single('profilePicture')