import { WORKSPACE_NAME_RULES } from '@/shared/validation/workspace-name.rules.ts'

export class WorkspaceName {
    constructor(public readonly value: string) {
        if (!value || value.trim().length < WORKSPACE_NAME_RULES.minLength) {
            throw new Error(`Workspace name must be at least ${WORKSPACE_NAME_RULES.minLength} characters long`)
        }

        if (value.length > WORKSPACE_NAME_RULES.maxLength) {
            throw new Error(`Workspace name cannot be longer than ${WORKSPACE_NAME_RULES.maxLength} characters`)
        }
    }
}