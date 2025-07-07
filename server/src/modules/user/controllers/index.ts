import { changePassword } from './changePassword.ts'
import { updateUser } from './updateUser.ts'
import { userWorkspaces } from './userWorkspaces.ts'
import { verifyEmail } from './verifyEmail.ts'
import { deleteUser } from './deleteUser.ts'
import { forceChangeEmail } from './forceChangeEmail.ts'
import { getTotpSetupData } from './getTotpSetupData.ts'
import { enableTwoFa } from './enableTwoFa.ts'
import { disableTwoFa } from './disableTwoFa.ts'
import { verifyTwoFa } from './verifyTwoFa.ts'
import { workspaceUserInvitations } from './workspaceUserInvitations.ts'
import { getSessions } from './getSessions.ts'
import { terminateAllSessions } from './terminateAllSessions.ts'

export {
    changePassword,
    updateUser,
    userWorkspaces,
    verifyEmail,
    deleteUser,
    forceChangeEmail,
    getTotpSetupData,
    enableTwoFa,
    disableTwoFa,
    verifyTwoFa,
    workspaceUserInvitations,
    getSessions,
    terminateAllSessions
}

export default {
    changePassword,
    updateUser,
    userWorkspaces,
    verifyEmail,
    deleteUser,
    forceChangeEmail,
    getTotpSetupData,
    enableTwoFa,
    disableTwoFa,
    verifyTwoFa,
    workspaceUserInvitations,
    getSessions,
    terminateAllSessions
}