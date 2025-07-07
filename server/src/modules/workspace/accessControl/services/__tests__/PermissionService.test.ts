import { describe, it, expect } from 'vitest'
import { WorkspaceRole } from '@/modules/member/types.ts'
import { WORKSPACE_PERMISSIONS } from '../../permissions.ts'
import { PermissionService } from '../PermissionService.ts'

describe('PermissionService', () => {
    const { workspace, member, screen, playlist } = WORKSPACE_PERMISSIONS

    describe('hasPermission', () => {
        it('should return true for base permission in role', () => {
            expect(
                PermissionService.hasPermission('member', workspace.view)
            ).toBe(true)
        })

        it('should return true for wildcard match (e.g. screen:create)', () => {
            expect(
                PermissionService.hasPermission('admin', screen.create)
            ).toBe(true)
        })

        it('should return false for denied permission', () => {
            expect(
                PermissionService.hasPermission('admin', workspace.delete)
            ).toBe(false)
        })

        it('should return false for explicitly granted permission if denied by role', () => {
            expect(
                PermissionService.hasPermission('member', member.add_admins, [
                    member.add_admins,
                ])
            ).toBe(false)
        })

        it('should return false if permission is not granted nor explicitly added', () => {
            expect(
                PermissionService.hasPermission('member', playlist.delete)
            ).toBe(false)
        })

        it('should return false for unknown role', () => {
            expect(
                PermissionService.hasPermission('unknown-role' as WorkspaceRole, playlist.view)
            ).toBe(false)
        })
    })

    describe('getPermissionsStatus', () => {
        it('should return full map with true/false for admin role', () => {
            const status = PermissionService.getPermissionsStatus('admin')

            expect(status[workspace.view]).toBe(true)
            expect(status[workspace.delete]).toBe(false)
        })

        it('should reflect explicitPermissions in the map', () => {
            const explicit = [member.add_admins]
            const status = PermissionService.getPermissionsStatus('admin', explicit)

            expect(status[member.add_admins]).toBe(true)
        })
    })
})
