import { TransactionType } from '@/shared/constants/enums'

interface CategoryVisualPreset {
  icon: string
  color: string
}

const EXPENSE_PRESET_BY_NAME: Record<string, CategoryVisualPreset> = {
  'food and drinks': { icon: 'utensils', color: '#f97316' },
  'food and dricker': { icon: 'utensils', color: '#f97316' },
  coffee: { icon: 'utensils', color: '#f97316' },
  groceries: { icon: 'utensils', color: '#f97316' },
  breakfast: { icon: 'utensils', color: '#f97316' },
  lunch: { icon: 'utensils', color: '#f97316' },
  dinner: { icon: 'utensils', color: '#f97316' },
  snacks: { icon: 'utensils', color: '#f97316' },
  'dining out': { icon: 'utensils', color: '#f97316' },
  delivery: { icon: 'utensils', color: '#f97316' },
  transport: { icon: 'car', color: '#3b82f6' },
  fuel: { icon: 'car', color: '#3b82f6' },
  'public transport': { icon: 'car', color: '#3b82f6' },
  'ride hailing': { icon: 'car', color: '#3b82f6' },
  'parking and toll': { icon: 'car', color: '#3b82f6' },
  'vehicle maintenance': { icon: 'car', color: '#3b82f6' },
  housing: { icon: 'building-2', color: '#6366f1' },
  rent: { icon: 'building-2', color: '#6366f1' },
  mortgage: { icon: 'building-2', color: '#6366f1' },
  'home maintenance': { icon: 'building-2', color: '#6366f1' },
  furnishing: { icon: 'building-2', color: '#6366f1' },
  shopping: { icon: 'shopping-bag', color: '#ec4899' },
  clothing: { icon: 'shopping-bag', color: '#ec4899' },
  electronics: { icon: 'shopping-bag', color: '#ec4899' },
  'home needs': { icon: 'shopping-bag', color: '#ec4899' },
  'personal items': { icon: 'shopping-bag', color: '#ec4899' },
  entertainment: { icon: 'film', color: '#8b5cf6' },
  movies: { icon: 'film', color: '#8b5cf6' },
  games: { icon: 'film', color: '#8b5cf6' },
  streaming: { icon: 'film', color: '#8b5cf6' },
  music: { icon: 'film', color: '#8b5cf6' },
  hobbies: { icon: 'film', color: '#8b5cf6' },
  health: { icon: 'heart-pulse', color: '#ef4444' },
  'health and wellness': { icon: 'heart-pulse', color: '#ef4444' },
  pharmacy: { icon: 'heart-pulse', color: '#ef4444' },
  doctor: { icon: 'heart-pulse', color: '#ef4444' },
  fitness: { icon: 'heart-pulse', color: '#ef4444' },
  'health insurance': { icon: 'heart-pulse', color: '#ef4444' },
  'bills and utilities': { icon: 'receipt-text', color: '#06b6d4' },
  electricity: { icon: 'receipt-text', color: '#06b6d4' },
  water: { icon: 'receipt-text', color: '#06b6d4' },
  internet: { icon: 'receipt-text', color: '#06b6d4' },
  'mobile phone': { icon: 'receipt-text', color: '#06b6d4' },
  gas: { icon: 'receipt-text', color: '#06b6d4' },
  education: { icon: 'graduation-cap', color: '#eab308' },
  books: { icon: 'graduation-cap', color: '#eab308' },
  courses: { icon: 'graduation-cap', color: '#eab308' },
  tuition: { icon: 'graduation-cap', color: '#eab308' },
  certification: { icon: 'graduation-cap', color: '#eab308' },
  travel: { icon: 'plane', color: '#14b8a6' },
  flight: { icon: 'plane', color: '#14b8a6' },
  hotel: { icon: 'plane', color: '#14b8a6' },
  'local transport': { icon: 'plane', color: '#14b8a6' },
  activities: { icon: 'plane', color: '#14b8a6' },
  'family and kids': { icon: 'sparkles', color: '#0ea5e9' },
  childcare: { icon: 'sparkles', color: '#0ea5e9' },
  'school needs': { icon: 'sparkles', color: '#0ea5e9' },
  'baby needs': { icon: 'sparkles', color: '#0ea5e9' },
  'debt and fees': { icon: 'credit-card', color: '#f43f5e' },
  'loan payment': { icon: 'credit-card', color: '#f43f5e' },
  'credit card fee': { icon: 'credit-card', color: '#f43f5e' },
  'bank fee': { icon: 'credit-card', color: '#f43f5e' },
  'charity and donations': { icon: 'gift', color: '#22c55e' },
  charity: { icon: 'gift', color: '#22c55e' },
  'religious giving': { icon: 'gift', color: '#22c55e' },
  taxes: { icon: 'receipt-text', color: '#f59e0b' },
  'income tax': { icon: 'receipt-text', color: '#f59e0b' },
  'property tax': { icon: 'receipt-text', color: '#f59e0b' },
  'personal care': { icon: 'sparkles', color: '#a855f7' },
  skincare: { icon: 'sparkles', color: '#a855f7' },
  haircut: { icon: 'sparkles', color: '#a855f7' },
  toiletries: { icon: 'sparkles', color: '#a855f7' },
  others: { icon: 'circle-ellipsis', color: '#6b7280' },
  miscellaneous: { icon: 'circle-ellipsis', color: '#6b7280' },
  emergency: { icon: 'circle-ellipsis', color: '#6b7280' },
}

const INCOME_PRESET_BY_NAME: Record<string, CategoryVisualPreset> = {
  salary: { icon: 'briefcase-business', color: '#16a34a' },
  'base salary': { icon: 'briefcase-business', color: '#16a34a' },
  bonus: { icon: 'gift', color: '#f97316' },
  overtime: { icon: 'briefcase-business', color: '#16a34a' },
  commission: { icon: 'briefcase-business', color: '#16a34a' },
  freelance: { icon: 'laptop', color: '#22c55e' },
  'project payment': { icon: 'laptop', color: '#22c55e' },
  consulting: { icon: 'laptop', color: '#22c55e' },
  retainer: { icon: 'laptop', color: '#22c55e' },
  investment: { icon: 'trending-up', color: '#10b981' },
  dividends: { icon: 'trending-up', color: '#10b981' },
  'capital gain': { icon: 'trending-up', color: '#10b981' },
  interest: { icon: 'trending-up', color: '#10b981' },
  'crypto profit': { icon: 'trending-up', color: '#10b981' },
  business: { icon: 'building-2', color: '#059669' },
  'product sales': { icon: 'building-2', color: '#059669' },
  'service income': { icon: 'building-2', color: '#059669' },
  'profit share': { icon: 'building-2', color: '#059669' },
  'rental income': { icon: 'building-2', color: '#2563eb' },
  'property rent': { icon: 'building-2', color: '#2563eb' },
  'vehicle rent': { icon: 'building-2', color: '#2563eb' },
  gift: { icon: 'gift', color: '#f97316' },
  'gift and support': { icon: 'gift', color: '#f97316' },
  'cash gift': { icon: 'gift', color: '#f97316' },
  'family support': { icon: 'gift', color: '#f97316' },
  rewards: { icon: 'gift', color: '#f97316' },
  'refund and reimbursements': { icon: 'hand-coins', color: '#15803d' },
  others: { icon: 'badge-dollar-sign', color: '#15803d' },
  refund: { icon: 'hand-coins', color: '#15803d' },
  reimbursement: { icon: 'hand-coins', color: '#15803d' },
  cashback: { icon: 'hand-coins', color: '#15803d' },
  'side hustle': { icon: 'laptop', color: '#0ea5e9' },
  'online sales': { icon: 'laptop', color: '#0ea5e9' },
  'content creator': { icon: 'laptop', color: '#0ea5e9' },
  affiliate: { icon: 'laptop', color: '#0ea5e9' },
  'misc income': { icon: 'hand-coins', color: '#15803d' },
}

const EXPENSE_KEYWORD_PRESETS: Array<{
  keywords: string[]
  preset: CategoryVisualPreset
}> = [
  {
    keywords: [
      'food',
      'drink',
      'dricker',
      'coffee',
      'meal',
      'restaurant',
      'grocery',
      'breakfast',
      'lunch',
      'dinner',
      'snack',
    ],
    preset: EXPENSE_PRESET_BY_NAME['food and drinks'],
  },
  {
    keywords: ['transport', 'car', 'bus', 'taxi', 'fuel', 'gas'],
    preset: EXPENSE_PRESET_BY_NAME.transport,
  },
  {
    keywords: ['housing', 'rent', 'mortgage', 'home', 'house', 'furnishing'],
    preset: EXPENSE_PRESET_BY_NAME.housing,
  },
  {
    keywords: ['shop', 'shopping', 'market', 'mall'],
    preset: EXPENSE_PRESET_BY_NAME.shopping,
  },
  {
    keywords: ['movie', 'film', 'game', 'entertainment'],
    preset: EXPENSE_PRESET_BY_NAME.entertainment,
  },
  {
    keywords: ['health', 'medical', 'doctor', 'hospital'],
    preset: EXPENSE_PRESET_BY_NAME.health,
  },
  {
    keywords: ['bill', 'utility', 'electric', 'water', 'internet', 'phone'],
    preset: EXPENSE_PRESET_BY_NAME['bills and utilities'],
  },
  {
    keywords: ['tax', 'taxes'],
    preset: EXPENSE_PRESET_BY_NAME.taxes,
  },
  {
    keywords: ['loan', 'debt', 'bank fee', 'card fee'],
    preset: EXPENSE_PRESET_BY_NAME['debt and fees'],
  },
  {
    keywords: ['education', 'school', 'course', 'class', 'study'],
    preset: EXPENSE_PRESET_BY_NAME.education,
  },
  {
    keywords: ['travel', 'flight', 'trip', 'hotel'],
    preset: EXPENSE_PRESET_BY_NAME.travel,
  },
  {
    keywords: ['personal', 'beauty', 'care', 'spa', 'barber'],
    preset: EXPENSE_PRESET_BY_NAME['personal care'],
  },
  {
    keywords: ['charity', 'donation', 'religious'],
    preset: EXPENSE_PRESET_BY_NAME['charity and donations'],
  },
  {
    keywords: ['family', 'kid', 'child', 'baby'],
    preset: EXPENSE_PRESET_BY_NAME['family and kids'],
  },
]

const INCOME_KEYWORD_PRESETS: Array<{
  keywords: string[]
  preset: CategoryVisualPreset
}> = [
  {
    keywords: ['salary', 'payroll', 'wage'],
    preset: INCOME_PRESET_BY_NAME.salary,
  },
  {
    keywords: ['freelance', 'contract', 'project'],
    preset: INCOME_PRESET_BY_NAME.freelance,
  },
  {
    keywords: ['investment', 'dividend', 'stock', 'crypto'],
    preset: INCOME_PRESET_BY_NAME.investment,
  },
  {
    keywords: ['business', 'revenue', 'sales'],
    preset: INCOME_PRESET_BY_NAME.business,
  },
  {
    keywords: ['rental', 'rent'],
    preset: INCOME_PRESET_BY_NAME['rental income'],
  },
  {
    keywords: ['refund', 'reimburse', 'cashback'],
    preset: INCOME_PRESET_BY_NAME['refund and reimbursements'],
  },
  {
    keywords: ['side hustle', 'affiliate', 'creator'],
    preset: INCOME_PRESET_BY_NAME['side hustle'],
  },
  {
    keywords: ['gift', 'bonus', 'reward'],
    preset: INCOME_PRESET_BY_NAME.gift,
  },
]

const EXPENSE_FALLBACK_PRESET: CategoryVisualPreset = {
  icon: 'circle-ellipsis',
  color: '#dc2626',
}

const INCOME_FALLBACK_PRESET: CategoryVisualPreset = {
  icon: 'badge-dollar-sign',
  color: '#16a34a',
}

const TRANSFER_FALLBACK_PRESET: CategoryVisualPreset = {
  icon: 'wallet',
  color: '#2563eb',
}

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchKeywordPreset(
  normalizedName: string,
  presetRules: Array<{ keywords: string[]; preset: CategoryVisualPreset }>,
) {
  return presetRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedName.includes(keyword)),
  )?.preset
}

export function inferCategoryVisual(
  name: string,
  type: TransactionType,
): CategoryVisualPreset {
  const normalizedName = normalizeName(name)

  if (type === TransactionType.EXPENSE) {
    if (normalizedName in EXPENSE_PRESET_BY_NAME) {
      return EXPENSE_PRESET_BY_NAME[normalizedName]
    }

    return (
      matchKeywordPreset(normalizedName, EXPENSE_KEYWORD_PRESETS) ??
      EXPENSE_FALLBACK_PRESET
    )
  }

  if (type === TransactionType.INCOME) {
    if (normalizedName in INCOME_PRESET_BY_NAME) {
      return INCOME_PRESET_BY_NAME[normalizedName]
    }

    return (
      matchKeywordPreset(normalizedName, INCOME_KEYWORD_PRESETS) ??
      INCOME_FALLBACK_PRESET
    )
  }

  return TRANSFER_FALLBACK_PRESET
}
