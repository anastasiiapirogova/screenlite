#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

/**
 * Script to replace .ts imports with .js imports in the dist directory
 * Node.js requires explicit .js extensions for ES module imports
 */

const DIST_DIR = './dist'

function replaceTsImports(content) {
    // Replace .ts with .js in import/export/require/dynamic import statements
    // Handles minified, non-minified, and all spacing
    return content
        // import ... from "..."
        .replace(/(from\s*['"])([^'"]+?)\.ts(['"])/g, '$1$2.js$3')
        // export ... from "..."
        .replace(/(export\s+\{[^}]*\}\s*from\s*['"])([^'"]+?)\.ts(['"])/g, '$1$2.js$3')
        // require("...ts")
        .replace(/(require\(['"])([^'"]+?)\.ts(['"]\))/g, '$1$2.js$3')
        // dynamic import("...ts")
        .replace(/(import\(['"])([^'"]+?)\.ts(['"]\))/g, '$1$2.js$3')
        // bare import "...ts"
        .replace(/(import\s*['"])([^'"]+?)\.ts(['"])/g, '$1$2.js$3')
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        const modifiedContent = replaceTsImports(content)

        if (content !== modifiedContent) {
            fs.writeFileSync(filePath, modifiedContent, 'utf8')
            console.log(`✅ Fixed imports in: ${filePath}`)
            return true
        }

        return false
    } catch (error) {
        console.error(`❌ Error processing file ${filePath}:`, error.message)
        return false
    }
}

async function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.error(`❌ Directory does not exist: ${dirPath}`)
        return
    }

    console.log(`🔍 Processing directory: ${dirPath}`)

    // Find all JavaScript files in the dist directory using glob
    const pattern = path.join(dirPath, '**/*.js')
    const files = await glob(pattern, { nodir: true })

    if (files.length === 0) {
        console.log('⚠️  No JavaScript files found in dist directory')
        return
    }

    let processedCount = 0
    let modifiedCount = 0

    for (const file of files) {
        processedCount++
        if (processFile(file)) {
            modifiedCount++
        }
    }

    console.log('\n📊 Summary:')
    console.log(`   Files processed: ${processedCount}`)
    console.log(`   Files modified: ${modifiedCount}`)

    if (modifiedCount > 0) {
        console.log(`\n✅ Successfully fixed .ts imports in ${modifiedCount} files`)
    } else {
        console.log('\nℹ️  No files needed import fixes')
    }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
    const distPath = process.argv[2] || DIST_DIR

    processDirectory(distPath).catch(error => {
        console.error('❌ Error:', error.message)
        process.exit(1)
    })
}

export { processDirectory, replaceTsImports } 