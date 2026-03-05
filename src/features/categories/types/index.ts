import type { TransactionType } from '@/shared/constants/enums'

export interface Category {
  id: string
  userId: string
  name: string
  type: TransactionType
  color: string | null
  icon: string | null
  parentId: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryTree extends Category {
  children: CategoryTree[]
}
