import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  to: string
  label: string
  icon: LucideIcon
  index: string
  compact?: boolean
  onNavigate?: () => void
}

export function NavItem({
  to,
  label,
  icon: Icon,
  index,
  compact = false,
  onNavigate,
}: NavItemProps) {
  const wrapperClassName = compact
    ? 'h-auto w-auto justify-start rounded-none p-0'
    : 'h-auto w-full justify-start rounded-none p-0'

  const baseClassName = compact
    ? cn(
        'group inline-flex items-center gap-2.5 whitespace-nowrap border border-black/25 bg-white/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/75',
        'transition-all hover:-translate-y-px hover:border-black hover:bg-white hover:text-black hover:shadow-[3px_3px_0_0_#000]',
        'data-[status=active]:-translate-y-px data-[status=active]:border-black data-[status=active]:bg-white data-[status=active]:text-black data-[status=active]:shadow-[3px_3px_0_0_#000]',
      )
    : cn(
        'group relative flex items-center gap-3.5 border border-black/20 bg-white/70 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-black/80',
        'transition-all hover:-translate-y-px hover:translate-x-px hover:border-black hover:bg-white hover:text-black hover:shadow-[4px_4px_0_0_#000]',
        'data-[status=active]:-translate-y-px data-[status=active]:translate-x-px data-[status=active]:border-black data-[status=active]:bg-white data-[status=active]:text-black data-[status=active]:shadow-[4px_4px_0_0_#000]',
      )

  return (
    <Button asChild variant="ghost" className={cn(wrapperClassName, baseClassName)}>
      <Link to={to} onClick={onNavigate}>
        <span
          className={cn(
            'font-mono text-[9px] font-semibold tracking-[0.24em] text-black/35 transition-colors group-hover:text-current',
            'group-data-[status=active]:text-current',
            compact ? 'w-auto' : 'w-7',
          )}
        >
          {index}
        </span>
        <Icon size={14} strokeWidth={2.4} />
        {label}
      </Link>
    </Button>
  )
}
