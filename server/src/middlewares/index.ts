import { authMiddleware } from './authMiddleware.ts'
import { corsMiddleware } from './corsMiddleware.ts'
import { errorHandler } from './errorHandler.ts'
import { notFoundHandler } from './notFoundHandler.ts'

export {
    authMiddleware,
    corsMiddleware,
    errorHandler,
    notFoundHandler
}

export default {
    authMiddleware,
    corsMiddleware,
    errorHandler,
    notFoundHandler
}