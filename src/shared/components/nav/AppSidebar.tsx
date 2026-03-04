import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  PieChart,
  Settings,
} from 'lucide-react'
import { NavItem } from './NavItem'

const NAV_ITEMS = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/app/accounts', label: 'Accounts', icon: Wallet },
  { to: '/app/budgets', label: 'Budgets', icon: PieChart },
  { to: '/app/goals', label: 'Goals', icon: Target },
  { to: '/app/settings', label: 'Settings', icon: Settings },
] as const

export function AppSidebar() {
  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-black">
      {/* Logo / Brand */}
      <div className="border-b border-black px-4 py-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          ■ Money Manager
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-black px-4 py-3">
        <p className="text-[10px] text-muted-foreground">
          {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  )
}
