import { z } from 'zod'

export const createLinkSchema = z.object({
    name: z.string().min(1, 'LINK_NAME_IS_REQUIRED').max(255, 'LINK_NAME_TOO_LONG'),
    type: z.enum(['stream', 'website'], {
        errorMap: () => ({ message: 'LINK_TYPE_MUST_BE_STREAM_OR_WEBSITE' })
    }),
    url: z.string().url('LINK_URL_MUST_BE_VALID_URL'),
    width: z.number().min(1).max(10000).optional(),
    height: z.number().min(1).max(10000).optional(),
    defaultDuration: z.number().min(1).max(86400).optional(),
    availabilityStartAt: z.date().optional(),
    availabilityEndAt: z.date().optional(),
    streamType: z.enum(['rtmp', 'hls', 'dash']).optional(),
    streamQuality: z.enum(['low', 'medium', 'high', 'auto']).optional(),
    refreshInterval: z.number().min(1).max(3600).optional()
}).refine((data) => {
    if (data.type === 'stream' && !data.streamType) {
        return false
    }
    return true
}, {
    message: 'STREAM_TYPE_IS_REQUIRED_FOR_STREAM_LINKS',
    path: ['streamType']
}).refine((data) => {
    if (data.availabilityStartAt && data.availabilityEndAt) {
        return data.availabilityStartAt < data.availabilityEndAt
    }
    return true
}, {
    message: 'AVAILABILITY_START_MUST_BE_BEFORE_END',
    path: ['availabilityEndAt']
})

export const updateLinkSchema = z.object({
    linkId: z.string().nonempty('LINK_ID_IS_REQUIRED'),
    name: z.string().min(1, 'LINK_NAME_IS_REQUIRED').max(255, 'LINK_NAME_TOO_LONG').optional(),
    type: z.enum(['stream', 'website'], {
        errorMap: () => ({ message: 'LINK_TYPE_MUST_BE_STREAM_OR_WEBSITE' })
    }).optional(),
    url: z.string().url('LINK_URL_MUST_BE_VALID_URL').optional(),
    width: z.number().min(1).max(10000).optional(),
    height: z.number().min(1).max(10000).optional(),
    defaultDuration: z.number().min(1).max(86400).optional(),
    availabilityStartAt: z.date().optional(),
    availabilityEndAt: z.date().optional(),
    streamType: z.enum(['rtmp', 'hls', 'dash']).optional(),
    streamQuality: z.enum(['low', 'medium', 'high', 'auto']).optional(),
    refreshInterval: z.number().min(1).max(3600).optional()
}).refine((data) => {
    if (data.availabilityStartAt && data.availabilityEndAt) {
        return data.availabilityStartAt < data.availabilityEndAt
    }
    return true
}, {
    message: 'AVAILABILITY_START_MUST_BE_BEFORE_END',
    path: ['availabilityEndAt']
})

export const deleteLinksSchema = z.object({
    linkIds: z.array(z.string().nonempty('LINK_ID_IS_REQUIRED')).min(1, 'AT_LEAST_ONE_LINK_ID_IS_REQUIRED')
})

export const restoreLinksSchema = z.object({
    linkIds: z.array(z.string().nonempty('LINK_ID_IS_REQUIRED')).min(1, 'AT_LEAST_ONE_LINK_ID_IS_REQUIRED')
}) 