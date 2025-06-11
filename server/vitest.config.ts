import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@config': path.resolve(__dirname, './src/config'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '*': path.resolve(__dirname, './src/*')
        },
    },
    test: {
        globals: true,
        environment: 'node',
    },
})