/** Monetary amount stored as integer cents/smallest unit */
export type Money = number

/** Database record ID */
export type ID = string

export interface Pagination {
  cursor?: ID
  limit: number
  total?: number
}

export interface DateRange {
  from: Date
  to: Date
}

export type SortOrder = 'asc' | 'desc'
