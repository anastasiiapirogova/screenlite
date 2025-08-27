import { z } from 'zod'

export const fileKey = z.string().regex(/^[a-zA-Z0-9_\-./]+$/).max(512)