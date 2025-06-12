import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@config': path.resolve(__dirname, './src/config'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@services': path.resolve(__dirname, './src/services'),
            '@generated': path.resolve(__dirname, './src/generated'),
            '*': path.resolve(__dirname, './src/*')
        },
    },
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./tests/setup.ts'],
    },
})