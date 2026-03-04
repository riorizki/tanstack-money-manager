import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/shared/components/nav/AppSidebar'

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
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
