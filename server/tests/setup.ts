import { afterAll, beforeAll } from 'vitest'
import { services } from 'oldsrc/services/index.ts'

beforeAll(async () => {
    await services.prisma.connect()
})

afterAll(() => {
    services.prisma.disconnect()
})