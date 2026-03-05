import {
  CircleDollarSign,
  CreditCard,
  Landmark,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AccountType } from '@/shared/constants/enums'

interface AccountTypeIconProps {
  type: AccountType
  className?: string
  size?: number
  strokeWidth?: number
}

const ICON_MAP = {
  [AccountType.CASH]: Wallet,
  [AccountType.BANK]: Landmark,
  [AccountType.EWALLET]: CircleDollarSign,
  [AccountType.CREDIT_CARD]: CreditCard,
  [AccountType.INVESTMENT]: TrendingUp,
  [AccountType.OTHER]: CircleDollarSign,
} as const

export function AccountTypeIcon({
  type,
  className,
  size = 16,
  strokeWidth = 2.2,
}: AccountTypeIconProps) {
  const Icon = ICON_MAP[type]

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={cn('text-black/75', className)}
      aria-hidden
    />
  )
}
