export interface WorkspaceInvitationEmailData {
    email: string
    workspaceName: string
    inviterName: string
    invitationToken: string
}

export class WorkspaceInvitationEmailTemplate {
    static getSubject(data: WorkspaceInvitationEmailData): string {
        return `Invitation to join ${data.workspaceName} - Screenlite`
    }

    static getHtml(data: WorkspaceInvitationEmailData, frontendUrl: string): string {
        const { workspaceName, inviterName, invitationToken } = data
        const invitationUrl = `${frontendUrl}/invitations/${invitationToken}`
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Workspace Invitation</h2>
                <p>You've been invited to join the workspace <strong>${workspaceName}</strong> by ${inviterName}.</p>
                <p>Click the button below to accept the invitation:</p>
                <a href="${invitationUrl}" 
                   style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                    Accept Invitation
                </a>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${invitationUrl}</p>
                <p>This invitation will expire in 7 days.</p>
            </div>
        `
    }

    static getText(data: WorkspaceInvitationEmailData, frontendUrl: string): string {
        const { workspaceName, inviterName, invitationToken } = data
        const invitationUrl = `${frontendUrl}/invitations/${invitationToken}`
        
        return `
            Workspace Invitation
            
            You've been invited to join the workspace "${workspaceName}" by ${inviterName}.
            
            To accept the invitation, visit:
            ${invitationUrl}
            
            This invitation will expire in 7 days.
        `
    }
} 