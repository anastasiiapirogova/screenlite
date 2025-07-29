import accountStatusPreHandlerHook from './account-status-pre-handler.hook.ts'
import authCheckHook from './auth-check.hook.ts'

export default {
    accountStatusPreHandler: accountStatusPreHandlerHook,
    authCheck: authCheckHook
}