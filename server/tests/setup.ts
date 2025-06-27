import { initPrisma, prisma } from '@/config/prisma.ts'
import { afterAll, beforeAll } from 'vitest'

beforeAll(async () => {
    await initPrisma()
})

afterAll(() => {
    prisma.$disconnect()
})