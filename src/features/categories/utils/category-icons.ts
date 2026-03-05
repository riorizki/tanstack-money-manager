import type { LucideIcon } from 'lucide-react'
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  Car,
  CircleEllipsis,
  CreditCard,
  Film,
  Gift,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Laptop,
  Plane,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Utensils,
  Wallet,
} from 'lucide-react'
import type { TransactionType } from '@/shared/constants/enums'
import { inferCategoryVisual } from './category-presets'

export interface CategoryIconOption {
  value: string
  label: string
  Icon: LucideIcon
}

const ICON_OPTIONS: CategoryIconOption[] = [
  { value: 'utensils', label: 'Food & Drinks', Icon: Utensils },
  { value: 'car', label: 'Transport', Icon: Car },
  { value: 'shopping-bag', label: 'Shopping', Icon: ShoppingBag },
  { value: 'film', label: 'Entertainment', Icon: Film },
  { value: 'heart-pulse', label: 'Health', Icon: HeartPulse },
  { value: 'receipt-text', label: 'Bills', Icon: ReceiptText },
  { value: 'graduation-cap', label: 'Education', Icon: GraduationCap },
  { value: 'plane', label: 'Travel', Icon: Plane },
  { value: 'sparkles', label: 'Personal Care', Icon: Sparkles },
  { value: 'briefcase-business', label: 'Salary', Icon: BriefcaseBusiness },
  { value: 'laptop', label: 'Freelance', Icon: Laptop },
  { value: 'trending-up', label: 'Investment', Icon: TrendingUp },
  { value: 'building-2', label: 'Building', Icon: Building2 },
  { value: 'gift', label: 'Gift', Icon: Gift },
  { value: 'hand-coins', label: 'Other Income', Icon: HandCoins },
  { value: 'badge-dollar-sign', label: 'Income', Icon: BadgeDollarSign },
  { value: 'wallet', label: 'Transfer', Icon: Wallet },
  { value: 'circle-ellipsis', label: 'Others', Icon: CircleEllipsis },
  { value: 'credit-card', label: 'Card', Icon: CreditCard },
]

const ICON_OPTION_BY_VALUE = new Map(
  ICON_OPTIONS.map((option) => [option.value, option]),
)

export const EXPENSE_ICON_OPTIONS: CategoryIconOption[] = [
  'utensils',
  'car',
  'building-2',
  'shopping-bag',
  'film',
  'heart-pulse',
  'receipt-text',
  'graduation-cap',
  'plane',
  'sparkles',
  'gift',
  'credit-card',
  'circle-ellipsis',
].map((value) => ICON_OPTION_BY_VALUE.get(value)!)

export const INCOME_ICON_OPTIONS: CategoryIconOption[] = [
  'briefcase-business',
  'laptop',
  'trending-up',
  'building-2',
  'gift',
  'hand-coins',
  'badge-dollar-sign',
  'circle-ellipsis',
].map((value) => ICON_OPTION_BY_VALUE.get(value)!)

export function getIconOptionsByType(type: TransactionType) {
  if (type === 'INCOME') {
    return INCOME_ICON_OPTIONS
  }

  return EXPENSE_ICON_OPTIONS
}

export function getCategoryIconOption(
  key: string | null | undefined,
  type: TransactionType,
  name: string,
): CategoryIconOption {
  const inferred = inferCategoryVisual(name, type)
  const inferredOption = ICON_OPTION_BY_VALUE.get(inferred.icon)

  if (key) {
    const explicitOption = ICON_OPTION_BY_VALUE.get(key)
    if (explicitOption) {
      return explicitOption
    }
  }

  if (inferredOption) {
    return inferredOption
  }

  return ICON_OPTION_BY_VALUE.get('circle-ellipsis')!
}
