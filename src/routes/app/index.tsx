import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: AppHomePage,
})

function AppHomePage() {
  return (
    <main className="page-wrap px-6 pb-10 pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">
        ■ Workspace
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.02em]">
        Welcome back.
      </h1>
      <p className="mt-2 max-w-xl text-sm text-black/55">
        Authentication is active. You can continue from here while dashboard and
        other modules are being implemented.
      </p>
    </main>
  )
}
