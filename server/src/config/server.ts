import { createServer } from 'node:http'
import { app } from './express.js'

const server = createServer(app)

export { server } 