import { ButtonHTMLAttributes, ReactElement } from 'react'

export type PaginationMeta = {
	page: number
	limit: number
	pages: number
	total: number
}

export type PaginatedResponse<T> = {
	items: T[]
	meta: PaginationMeta
}

export type PaginatedRequestFilter = {
	page: number
	limit: number
}

export type Resolution = {
	width: number
	height: number
}

export type ButtonElement = ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, 'button'> & { isLoading?: boolean }