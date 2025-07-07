#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const routes = []

function parseRouteFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    let currentRoute = null
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        
        if (line.includes('createRoute({') || line.includes('createWorkspaceRoute({') || line.includes('createGuestRoute({')) {
            currentRoute = {
                type: line.includes('createWorkspaceRoute') ? 'workspace' : line.includes('createGuestRoute') ? 'guest' : 'protected',
                method: '',
                path: '',
                handler: '',
                file: path.relative(process.cwd(), filePath)
            }
            
            for (let j = i; j < Math.min(i + 20, lines.length); j++) {
                const routeLine = lines[j].trim()
                
                if (routeLine.includes('method:')) {
                    const methodMatch = routeLine.match(/method:\s*HttpMethod\.(\w+)/)

                    if (methodMatch) {
                        currentRoute.method = methodMatch[1]
                    }
                }
                
                if (routeLine.includes('path:')) {
                    const pathMatch = routeLine.match(/path:\s*['"`]([^'"`]+)['"`]/)

                    if (pathMatch) {
                        let routePath = pathMatch[1]
                        
                        if (currentRoute.type === 'workspace' && !routePath.startsWith('/workspaces/:workspaceId')) {
                            if (routePath.startsWith('/')) {
                                routePath = `/workspaces/:workspaceId${routePath}`
                            } else {
                                routePath = `/workspaces/:workspaceId/${routePath}`
                            }
                        }
                        
                        currentRoute.path = routePath
                    }
                }
                
                if (routeLine.includes('handler:')) {
                    const handlerMatch = routeLine.match(/handler:\s*(\w+\.\w+)/)

                    if (handlerMatch) {
                        currentRoute.handler = handlerMatch[1]
                    }
                }
                
                if (routeLine === '})' && currentRoute.method && currentRoute.path) {
                    routes.push(currentRoute)
                    currentRoute = null
                    break
                }
            }
        }
    }
}

function findRouteFiles(dir) {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            findRouteFiles(filePath)
        } else if (file.endsWith('.ts')) {
            parseRouteFile(filePath)
        }
    }
}

function generateRouteList() {
    console.log('Scanning for routes...\n')
    
    findRouteFiles('./src')
    
    console.log('Route List:\n')
    
    routes.forEach(route => {
        const method = route.method.padEnd(6)
        const path = route.path.padEnd(80)
        const type = route.type.padEnd(6)
        const file = route.file.padEnd(30)
        
        console.log(`| ${method} | ${path} | ${type} | ${file} |`)
    })
    
    console.log('\nSummary:')
    console.log(`Total routes: ${routes.length}`)
    console.log(`Protected routes: ${routes.filter(r => r.type === 'protected').length}`)
    console.log(`Workspace routes: ${routes.filter(r => r.type === 'workspace').length}`)
    console.log(`Guest routes: ${routes.filter(r => r.type === 'guest').length}`)
}

generateRouteList() 