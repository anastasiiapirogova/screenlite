#!/usr/bin/env tsx

import { ConfigService } from '@/infrastructure/config/config.service.ts'
import { PrismaService } from '@/infrastructure/database/prisma.service.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { UserRole } from '@/core/enums/user-role.enum.ts'

class ScreenliteCLI {
    private config: ConfigService
    private prisma: PrismaService
    private userRepo!: PrismaUserRepository

    constructor() {
        this.config = new ConfigService()
        this.prisma = new PrismaService(this.config.database.url)
    }

    async initialize(): Promise<void> {
        await this.prisma.connect()
        this.userRepo = new PrismaUserRepository(this.prisma.client)
    }

    async cleanup(): Promise<void> {
        await this.prisma.disconnect()
    }

    async listUsers(): Promise<void> {
        console.log('Listing all users...\n')

        try {
            const users = await this.prisma.client.user.findMany({
                orderBy: { createdAt: 'desc' }
            })

            if (users.length === 0) {
                console.log('No users found in the database.')
                return
            }

            console.log('Users:')
            console.log('─'.repeat(80))
            console.log(`${'Email'.padEnd(30)} | ${'Name'.padEnd(20)} | ${'Role'.padEnd(12)} | ${'Created'}`)
            console.log('─'.repeat(80))

            for (const user of users) {
                const role = user.role as UserRole
                const roleDisplay = role === UserRole.SUPER_ADMIN ? 'SUPER_ADMIN' : 
                    role === UserRole.ADMIN ? 'ADMIN' : 'USER'
                const created = user.createdAt.toISOString().split('T')[0]

                console.log(`${user.email.padEnd(30)} | ${user.name.padEnd(20)} | ${roleDisplay.padEnd(12)} | ${created}`)
            }

            console.log('─'.repeat(80))
            console.log(`Total users: ${users.length}`)

        } catch (error) {
            console.error('Error listing users:', error)
            throw error
        }
    }

    async setUserRole(email: string, role: UserRole): Promise<void> {
        const roleName = role === UserRole.SUPER_ADMIN ? 'super admin' : 
            role === UserRole.ADMIN ? 'admin' : 'regular user'

        console.log(`Setting user with email "${email}" as ${roleName}...`)

        try {
            const user = await this.userRepo.findByEmail(email)

            if (!user) {
                throw new Error(`User with email "${email}" not found`)
            }

            if (user.role === role) {
                console.log(`User "${email}" is already a ${roleName}`)
                return
            }

            user.role = role
            await this.userRepo.save(user)

            console.log(`Successfully set user "${email}" as ${roleName}`)

        } catch (error) {
            console.error(`Error setting user as ${roleName}:`, error)
            throw error
        }
    }

    async showUserInfo(email: string): Promise<void> {
        console.log(`Showing information for user "${email}"...`)

        try {
            const user = await this.userRepo.findByEmail(email)

            if (!user) {
                throw new Error(`User with email "${email}" not found`)
            }

            const roleDisplay = user.role === UserRole.SUPER_ADMIN ? 'SUPER_ADMIN' : 
                user.role === UserRole.ADMIN ? 'ADMIN' : 'USER'

            console.log('\nUser Information:')
            console.log('─'.repeat(50))
            console.log(`Email: ${user.email}`)
            console.log(`Name: ${user.name}`)
            console.log(`Role: ${roleDisplay}`)
            console.log(`Email Verified: ${user.emailVerifiedAt ? 'Yes' : 'No'}`)
            console.log(`Created: ${user.emailVerifiedAt?.toISOString().split('T')[0] || 'N/A'}`)
            console.log('─'.repeat(50))

        } catch (error) {
            console.error('Error showing user info:', error)
            throw error
        }
    }

    async findSuperAdmins(): Promise<void> {
        console.log('Finding all super admins...')

        try {
            const superAdmins = await this.prisma.client.user.findMany({
                where: { role: UserRole.SUPER_ADMIN },
                orderBy: { createdAt: 'asc' }
            })

            if (superAdmins.length === 0) {
                console.log('No super admins found in the database.')
                return
            }

            console.log('\nSuper Admins:')
            console.log('─'.repeat(60))
            console.log(`${'Email'.padEnd(30)} | ${'Name'.padEnd(20)} | ${'Created'}`)
            console.log('─'.repeat(60))

            for (const admin of superAdmins) {
                const created = admin.createdAt.toISOString().split('T')[0]

                console.log(`${admin.email.padEnd(30)} | ${admin.name.padEnd(20)} | ${created}`)
            }

            console.log('─'.repeat(60))
            console.log(`Total super admins: ${superAdmins.length}`)

        } catch (error) {
            console.error('Error finding super admins:', error)
            throw error
        }
    }
}

function showHelp(): void {
    console.log(`
Screenlite CLI

Usage:
  npm run cli <command> [options]

Commands:
  users:list                           List all users with their roles
  users:info <email>                   Show detailed information for a user
  users:set-super-admin <email>        Set a user as super admin
  users:set-admin <email>              Set a user as admin
  users:set-user <email>               Set a user as regular user
  users:super-admins                   List all super admins
  help                                 Show this help message
`)
}

async function main(): Promise<void> {
    const args = process.argv.slice(2)

    if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
        showHelp()
        return
    }

    const cli = new ScreenliteCLI()

    try {
        await cli.initialize()

        const command = args[0]

        switch (command) {
            case 'users:list':
                await cli.listUsers()
                break

            case 'users:info':
                if (args.length !== 2) {
                    console.error('Usage: npm run cli users:info <email>')
                    process.exit(1)
                }
                await cli.showUserInfo(args[1])
                break

            case 'users:set-super-admin':
                if (args.length !== 2) {
                    console.error('Usage: npm run cli users:set-super-admin <email>')
                    process.exit(1)
                }
                await cli.setUserRole(args[1], UserRole.SUPER_ADMIN)
                break

            case 'users:set-admin':
                if (args.length !== 2) {
                    console.error('Usage: npm run cli users:set-admin <email>')
                    process.exit(1)
                }
                await cli.setUserRole(args[1], UserRole.ADMIN)
                break

            case 'users:set-user':
                if (args.length !== 2) {
                    console.error('Usage: npm run cli users:set-user <email>')
                    process.exit(1)
                }
                await cli.setUserRole(args[1], UserRole.USER)
                break

            case 'users:super-admins':
                await cli.findSuperAdmins()
                break

            default:
                console.error(`Unknown command: ${command}`)
                showHelp()
                process.exit(1)
        }

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error)
        process.exit(1)
    } finally {
        await cli.cleanup()
    }
}

main().catch((error) => {
    console.error('Unexpected error:', error)
    process.exit(1)
}) 