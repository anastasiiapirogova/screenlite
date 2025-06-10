import { createServer } from 'node:http'
import { app } from './express.js'

const server = createServer(app)

server.listen(3000, () => {
    console.log('Screenlite: Server running on port 3000')
})

export { server } 