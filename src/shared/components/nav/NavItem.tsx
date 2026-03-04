import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  to: string
  label: string
  icon: LucideIcon
}

export function NavItem({ to, label, icon: Icon }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 border-b border-black px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors',
        'hover:bg-black hover:text-white',
      )}
      activeProps={{ className: 'bg-black text-white' }}
    >
      <Icon size={14} strokeWidth={2.5} />
      {label}
    </Link>
  )
}
