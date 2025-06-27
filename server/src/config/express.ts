import express from 'express'
import bodyParser from 'body-parser'
import * as i18nextMiddleware from 'i18next-http-middleware'
import { i18n } from './i18n.ts'
import { staticRoutes } from '../routes/static.ts'
import { multerErrorHandler } from './multer.ts'
import swaggerUi from 'swagger-ui-express'
import { specs } from '../swagger/index.ts'
import { router } from '../routes/index.ts'
import Middlewares from '../middlewares/index.ts'
import helmet from 'helmet'

const app = express()

app.use(Middlewares.corsMiddleware)

// TODO: Add more helmet middleware
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.dnsPrefetchControl({ allow: false }))
app.use(helmet.noSniff())

app.use(i18nextMiddleware.handle(i18n))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.raw({ type: 'application/octet-stream', limit: '30mb' }))

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
