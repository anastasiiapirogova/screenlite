import express from 'express'
import bodyParser from 'body-parser'
import * as i18nextMiddleware from 'i18next-http-middleware'
import { i18n } from './i18n.js'
import { staticRoutes } from '../routes/static.js'
import { multerErrorHandler } from './multer.js'
import swaggerUi from 'swagger-ui-express'
import { specs } from '../swagger/index.js'
import { router } from '../routes/index.js'
import Middlewares from '../middlewares/index.js'

const app = express()

app.use(Middlewares.corsMiddleware)
app.use(i18nextMiddleware.handle(i18n))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.enable('etag')
app.disable('x-powered-by')

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use('/api/static', staticRoutes)
app.use('/api', router)

// app.use(express.static(path.join(__dirname, '../../../client/dist/')))

app.use('/api/*', Middlewares.notFoundHandler)

// app.get(/^((?!\/socket\.io).)*$/, (_req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '../../../client/dist/index.html'))
// })

app.use(multerErrorHandler)
app.use(Middlewares.errorHandler)

export { app }
