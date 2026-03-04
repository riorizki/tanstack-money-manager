import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_115%_at_0%_0%,#ffffff_0%,#f2f2f2_46%,#e8e8e8_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#d6d6d6_1px,transparent_1px),linear-gradient(to_bottom,#d6d6d6_1px,transparent_1px)] bg-size-[64px_64px]"
      />
      <section className="relative w-full max-w-136">
        <Outlet />
      </section>
    </main>
  )
}
