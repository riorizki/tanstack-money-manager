import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '#/shared/components/nav/AppSidebar'

export const Route = createFileRoute('/app')({
  beforeLoad: async () => {
    // Full auth check added in Phase 1 (JWT validation)
    // For now: stub — always allow
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
