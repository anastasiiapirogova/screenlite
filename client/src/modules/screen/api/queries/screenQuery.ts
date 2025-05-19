import { screenRequest } from '../requests/screenRequest'

export const screenQuery = (id: string) => ({
    queryKey: ['screen', { id }],
    queryFn: async () => screenRequest(id)
})