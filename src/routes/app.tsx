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
    <div className="min-h-screen bg-[#f4f4f4] md:flex">
      <AppSidebar />
      <main
        aria-label="Application Content"
        className="min-w-0 flex-1 overflow-y-auto"
      >
        <Outlet />
      </main>
    </div>
  )
}
