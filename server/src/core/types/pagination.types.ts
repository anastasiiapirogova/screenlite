export interface PaginationParams {
    page?: number
    limit?: number
}
  
export interface PaginationMeta {
    total: number
    totalPages: number
    currentPage: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
}
  
export interface PaginationResponse<T> {
    items: T[]
    meta: PaginationMeta
}