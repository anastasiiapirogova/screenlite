import { getTotpSetupDataRequest } from '../requests/getTotpSetupDataRequest'

export const totpSetupDataQuery = () => ({
    queryKey: ['totpSetupData'],
    queryFn: () => getTotpSetupDataRequest(),
    refetchOnWindowFocus: false,
})