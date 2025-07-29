import { PaginationParams, PaginationMeta, PaginationResponse } from '@/core/types/pagination.types.ts'

export class Paginator {
    static getPaginationParams(params?: PaginationParams) {
        const page = params?.page && params.page > 0 ? params.page : 1
        const limit = params?.limit && params.limit > 0 ? params.limit : 10
        const skip = (page - 1) * limit

        return { page, limit, skip }
    }

    static getPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
        const totalPages = Math.ceil(total / limit)

        return {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    }

    static async paginate<T>(
        findManyFn: (skip: number, take: number) => Promise<T[]>,
        countFn: () => Promise<number>,
        params?: PaginationParams
    ): Promise<PaginationResponse<T>> {
        const { page, limit, skip } = this.getPaginationParams(params)
    
        const [items, total] = await Promise.all([
            findManyFn(skip, limit),
            countFn()
        ])

        return {
            items,
            meta: this.getPaginationMeta(total, page, limit)
        }
    }
}