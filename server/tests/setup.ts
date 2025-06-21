import { initPrisma, prisma } from '@config/prisma.js'
import { afterAll, beforeAll } from 'vitest'

beforeAll(async () => {
    await initPrisma()
})

afterAll(() => {
    prisma.$disconnect()
})