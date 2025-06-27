import { createServer } from 'node:http'
import { app } from './express.ts'

const server = createServer(app)

export { server } 