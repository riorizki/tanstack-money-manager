import { cn } from '@/lib/utils'
import { inferCategoryVisual } from '../utils/category-presets'
import { getCategoryIconOption } from '../utils/category-icons'
import { getContrastColor } from '../utils/color-utils'
import type { Category } from '../types'

interface CategoryBadgeProps {
  category: Pick<Category, 'name' | 'color' | 'type' | 'icon'>
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const inferredVisual = inferCategoryVisual(category.name, category.type)
  const icon = getCategoryIconOption(category.icon, category.type, category.name)
  const categoryColor = category.color ?? inferredVisual.color
  const iconContrast = getContrastColor(categoryColor)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-medium text-black',
        className
      )}
    >
      <span
        className="flex h-5 w-5 items-center justify-center"
        style={{ backgroundColor: categoryColor }}
      >
        <icon.Icon 
          size={12} 
          strokeWidth={2}
          className={iconContrast === 'white' ? 'text-white' : 'text-black'}
        />
      </span>
      <span className="uppercase tracking-wide">{category.name}</span>
    </span>
  )
}
