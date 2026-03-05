import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { isLightColor } from '../utils/color-utils'

interface ColorPickerProps {
  value: string | null
  suggestedColor: string
  onChange: (color: string | null) => void
  disabled?: boolean
}

// Monochrome/gray scale palette + subtle colors
const COLOR_PALETTE = [
  // Grays
  '#000000', '#1f2937', '#374151', '#4b5563', '#6b7280',
  '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6', '#ffffff',
  // Subtle colors (desaturated)
  '#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ef4444',
  '#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316',
  '#713f12', '#854d0e', '#a16207', '#ca8a04', '#eab308',
  '#14532d', '#166534', '#15803d', '#16a34a', '#22c55e',
  '#064e3b', '#065f46', '#047857', '#059669', '#10b981',
  '#1e3a8a', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6',
  '#312e81', '#3730a3', '#4338ca', '#4f46e5', '#6366f1',
  '#581c87', '#6b21a8', '#7e22ce', '#9333ea', '#a855f7',
  '#831843', '#9d174d', '#be185d', '#db2777', '#ec4899',
] as const

export function ColorPicker({
  value,
  suggestedColor,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const [customColor, setCustomColor] = useState(value ?? suggestedColor)

  const currentColor = value ?? suggestedColor

  const handleColorSelect = (color: string) => {
    onChange(color)
    setOpen(false)
  }

  const handleCustomColorChange = (newColor: string) => {
    setCustomColor(newColor)
    if (/^#[A-Fa-f0-9]{6}$/.test(newColor)) {
      onChange(newColor)
    }
  }

  const handleClear = () => {
    onChange(null)
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
            open && 'ring-1 ring-black'
          )}
        >
          <span className="flex items-center gap-2">
            <span
              className="h-5 w-5 border border-black/20"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-sm text-black/70">
              {value ?? suggestedColor}
            </span>
          </span>
          <ChevronDown size={14} className="text-black/40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 rounded-none border border-black bg-white p-3 shadow-[6px_6px_0_0_#000]"
        align="start"
      >
        <div className="space-y-3">
          {/* Color Grid */}
          <div className="grid grid-cols-10 gap-1">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={cn(
                  'group relative h-6 w-6 border border-black/20 transition-all',
                  'hover:border-black hover:scale-110 focus:outline-none focus:ring-1 focus:ring-black',
                  currentColor === color && 'ring-1 ring-black'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              >
                {currentColor === color && (
                  <Check
                    size={12}
                    className={cn(
                      'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                      isLightColor(color) ? 'text-black' : 'text-white'
                    )}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-2 border-t border-black/10 pt-2">
            <Input
              type="text"
              value={value ?? ''}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              placeholder={suggestedColor}
              className="h-9 flex-1 rounded-none border border-black/20 bg-white text-sm uppercase placeholder:text-black/30 focus-visible:ring-1 focus-visible:ring-black"
            />
            <Input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="h-9 w-11 cursor-pointer rounded-none border border-black/20 bg-white p-1"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-black/10 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold uppercase tracking-wider text-black/50 hover:text-black"
            >
              Use Suggested
            </button>
            <span className="text-[10px] text-black/40 uppercase tracking-wider">
              Click to select
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
