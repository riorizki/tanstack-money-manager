import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/shared/constants/enums'
import { Check, ChevronDown, Sparkles } from 'lucide-react'
import { useState } from 'react'
import {
  EXPENSE_ICON_OPTIONS,
  INCOME_ICON_OPTIONS,
  getCategoryIconOption,
} from '../utils/category-icons'

interface IconPickerProps {
  value: string | null
  type: TransactionType
  categoryName: string
  onChange: (icon: string | null) => void
  disabled?: boolean
}

export function IconPicker({
  value,
  type,
  categoryName,
  onChange,
  disabled = false,
}: IconPickerProps) {
  const [open, setOpen] = useState(false)

  const iconOptions =
    type === 'INCOME' ? INCOME_ICON_OPTIONS : EXPENSE_ICON_OPTIONS
  const selectedIcon = getCategoryIconOption(value, type, categoryName)
  const suggestedIcon = getCategoryIconOption(null, type, categoryName)
  const isAutoSelected = value === null

  const handleIconSelect = (iconValue: string | null) => {
    onChange(iconValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-between rounded-none border border-black bg-white px-3',
            'hover:bg-black/5 focus-visible:ring-0 focus-visible:ring-offset-0',
            open && 'ring-1 ring-black',
          )}
        >
          <span className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center border border-black/20 bg-black/5',
                isAutoSelected && 'border-dashed border-black/30',
              )}
            >
              <selectedIcon.Icon size={12} className="text-black/70" />
            </span>
            <span className="text-sm text-black/70">
              {isAutoSelected
                ? `Auto: ${suggestedIcon.label}`
                : selectedIcon.label}
            </span>
          </span>
          <ChevronDown size={14} className="text-black/40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 rounded-none border border-black bg-white p-0 shadow-[6px_6px_0_0_#000]"
        align="start"
      >
        <div className="space-y-2 p-3">
          {/* Auto Option */}
          <button
            type="button"
            onClick={() => handleIconSelect(null)}
            className={cn(
              'flex w-full items-center gap-2 border px-2 py-2 transition-all',
              'hover:border-black hover:bg-black/5',
              isAutoSelected
                ? 'border-black bg-black text-white'
                : 'border-black/20 bg-transparent',
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center border',
                isAutoSelected
                  ? 'border-white/30'
                  : 'border-dashed border-black/30',
              )}
            >
              <Sparkles
                size={12}
                className={isAutoSelected ? 'text-white' : 'text-black/50'}
              />
            </span>
            <div className="flex-1 text-left">
              <p
                className={cn(
                  'text-sm font-medium',
                  isAutoSelected ? 'text-white' : 'text-black',
                )}
              >
                Auto-detect
              </p>
              <p
                className={cn(
                  'text-[10px] uppercase tracking-wider',
                  isAutoSelected ? 'text-white/60' : 'text-black/40',
                )}
              >
                {suggestedIcon.label}
              </p>
            </div>
            {isAutoSelected && <Check size={12} className="text-white" />}
          </button>

          <div className="border-t border-black/10 pt-2">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-black/40">
              Choose Icon
            </p>

            <ScrollArea className="h-36">
              <div className="grid grid-cols-5 gap-1.5 pr-2">
                {iconOptions.map((option) => {
                  const isSelected = value === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleIconSelect(option.value)}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center border transition-all',
                        'hover:border-black focus:outline-none',
                        isSelected
                          ? 'border-black bg-black'
                          : 'border-black/15 bg-white hover:bg-black/5',
                      )}
                      title={option.label}
                    >
                      <option.Icon
                        size={18}
                        strokeWidth={2}
                        className={isSelected ? 'text-white' : 'text-black/60'}
                      />
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
