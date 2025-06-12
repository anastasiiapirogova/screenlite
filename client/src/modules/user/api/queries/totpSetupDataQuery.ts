import { getTotpSetupDataRequest } from '../requests/getTotpSetupDataRequest'

export const totpSetupDataQuery = (userId: string) => ({
    queryKey: ['totpSetupData', { userId }],
    queryFn: () => getTotpSetupDataRequest(userId),
    refetchOnWindowFocus: false,
})