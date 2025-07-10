#!/usr/bin/env node
import { readdirSync, statSync, readFileSync, existsSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SRC_DIR = join(__dirname, '../src')
const ENV_DOCS_PATH = join(__dirname, '../env-docs.json')

function getAllSourceFiles(dir) {
    let results = []
    const list = readdirSync(dir)

    list.forEach(file => {
        const filePath = join(dir, file)
        const stat = statSync(filePath)

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllSourceFiles(filePath))
        } else if (filePath.match(/\.(js|ts)$/)) {
            results.push(filePath)
        }
    })

    return results
}

function extractEnvUsages(filePath) {
    const content = readFileSync(filePath, 'utf8')
    const regex = /process\.env(?:\.([A-Z0-9_]+)|\[['"]([A-Z0-9_]+)['"]\])/g
    const envs = new Set()
    let match

    while ((match = regex.exec(content))) {
        const env = match[1] || match[2]

        if (env) envs.add(env)
    }

    return envs
}

function loadEnvDocs() {
    if (existsSync(ENV_DOCS_PATH)) {
        return JSON.parse(readFileSync(ENV_DOCS_PATH, 'utf8'))
    }

    return {}
}

function saveEnvDocs(docs) {
    writeFileSync(ENV_DOCS_PATH, JSON.stringify(docs, null, 2) + '\n')
}

function main() {
    const files = getAllSourceFiles(SRC_DIR)
    const usedEnvs = new Set()

    files.forEach(file => {
        extractEnvUsages(file).forEach(env => usedEnvs.add(env))
    })

    const envDocs = loadEnvDocs()

    usedEnvs.forEach(env => {
        if (!envDocs[env]) {
            envDocs[env] = { description: '', used: true }
        } else {
            envDocs[env].used = true
        }
    })

    Object.keys(envDocs).forEach(env => {
        if (!usedEnvs.has(env)) {
            envDocs[env].used = false
        }
    })

    saveEnvDocs(envDocs)
    console.log(`Synced env-docs.json. Found ${usedEnvs.size} used envs.`)
}

main() 