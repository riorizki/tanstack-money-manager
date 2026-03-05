import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  PieChart,
  Settings,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { NavItem } from './NavItem'

const NAV_ITEMS = [
  {
    to: '/app/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    index: '01',
  },
  {
    to: '/app/transactions',
    label: 'Transactions',
    icon: ArrowLeftRight,
    index: '02',
  },
  { to: '/app/accounts', label: 'Accounts', icon: Wallet, index: '03' },
  { to: '/app/budgets', label: 'Budgets', icon: PieChart, index: '04' },
  { to: '/app/goals', label: 'Goals', icon: Target, index: '05' },
  { to: '/app/settings', label: 'Settings', icon: Settings, index: '06' },
] as const

export function AppSidebar() {
  const year = new Date().getFullYear()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const activeNavItem = NAV_ITEMS.find(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  )
  const activeLabel = activeNavItem?.label ?? 'Workspace'
  const activeIndex = activeNavItem?.index ?? '00'

  return (
    <>
      <header className="sticky top-0 z-30 relative border-b-2 border-black bg-[#f1f1f1] md:hidden">
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">
              ■ Workspace
            </p>
            <p className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-black">
              Money Manager
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">
              {activeIndex} • {activeLabel}
            </p>
          </div>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-none border-black bg-white px-3 text-[11px] font-bold uppercase tracking-[0.18em] shadow-[3px_3px_0_0_#000] hover:bg-black hover:text-white active:translate-x-px active:translate-y-px active:shadow-none"
                aria-label="Open navigation menu"
              >
                <Menu size={15} strokeWidth={2.4} />
                Menu
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              showCloseButton={false}
              className="w-[19rem] max-w-[88vw] gap-0 border-r-2 border-black bg-[#efefef] p-0"
            >
              <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)] [background-size:44px_44px]" />

              <SheetHeader className="relative border-b-2 border-black px-6 py-6 text-left">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black/35">
                      ■ System
                    </p>
                    <SheetTitle className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-black">
                      Money Manager
                    </SheetTitle>
                    <SheetDescription className="mt-1 text-[11px] uppercase tracking-[0.22em] text-black/40">
                      Control Surface
                    </SheetDescription>
                  </div>

                  <SheetClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-none border-black bg-white px-2.5 text-[10px] font-bold uppercase tracking-[0.15em] shadow-none hover:bg-black hover:text-white"
                    >
                      Close
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>

              <section className="relative flex-1 overflow-y-auto px-4 py-5">
                <div className="border border-black/20 bg-white/65 px-3 py-3 shadow-[3px_3px_0_0_#0000001f]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-black/38">
                    Active Module
                  </p>
                  <p className="mt-1 text-base font-extrabold tracking-[-0.02em] text-black">
                    {activeLabel}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/42">
                    Slot {activeIndex}
                  </p>
                </div>
                <h3 className="mt-5 px-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
                  Workspace
                </h3>
                <nav aria-label="Mobile Primary Navigation" className="mt-3">
                  <ul className="space-y-3">
                    {NAV_ITEMS.map((item) => (
                      <li key={item.to}>
                        <NavItem
                          to={item.to}
                          label={item.label}
                          icon={item.icon}
                          index={item.index}
                          onNavigate={() => setMobileNavOpen(false)}
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
              </section>

              <footer className="relative border-t-2 border-black px-6 py-4">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
                  <span>Local Build</span>
                  <span>{year}</span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-black/55">
                  Session secured. Select a module to continue.
                </p>
              </footer>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <aside
        aria-label="Primary Sidebar"
        className="relative hidden h-screen w-[19rem] shrink-0 flex-col border-r-2 border-black bg-[#efefef] md:sticky md:top-0 md:flex"
      >
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)] [background-size:44px_44px]" />

        <header className="relative px-6 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black/35">
            ■ System
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">
            Money Manager
          </h2>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-black/40">
            Control Surface
          </p>
        </header>

        <Separator className="relative bg-black" />

        <section className="relative flex-1 overflow-hidden px-4 py-5">
          <h3 className="px-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
            Workspace
          </h3>
          <nav aria-label="Primary Navigation" className="mt-3">
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavItem
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    index={item.index}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <Separator className="relative bg-black" />

        <footer className="relative px-6 py-4">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
            <span>Local Build</span>
            <span>{year}</span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-black/55">
            Session secured. Select a module to continue.
          </p>
        </footer>
      </aside>
    </>
  )
}
