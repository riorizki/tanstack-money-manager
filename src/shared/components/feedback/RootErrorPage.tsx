import { Button } from '@/components/ui/button'

interface RootErrorPageProps {
  message?: string
  onRetry?: () => void
}

export function RootErrorPage({
  message = 'An unexpected error occurred.',
  onRetry,
}: RootErrorPageProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(115%_115%_at_100%_0%,#ffffff_0%,#f2f2f2_46%,#e8e8e8_100%)] px-6 py-14">
      <div className="pointer-events-none absolute inset-4 border border-black/10 sm:inset-8" />
      <div className="relative w-full max-w-136">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-black/30">
          * System Error
        </p>

        <h1 className="mt-4 text-[5.5rem] font-extrabold leading-none tracking-[-0.04em] sm:text-[7rem]">
          500
        </h1>

        <div className="mt-4 border-l-2 border-black/20 pl-4">
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em]">
            Something went wrong.
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-black/50">
            {message}
          </p>
        </div>

        {onRetry ? (
          <Button
            type="button"
            onClick={onRetry}
            className="mt-8 inline-flex h-12 rounded-none border border-black bg-black px-7 text-[11px] font-bold uppercase tracking-[0.28em] text-white shadow-none transition-colors hover:bg-black/85 hover:text-white"
          >
            Try Again
          </Button>
        ) : null}

        <div className="mt-14 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/30">
          <span className="h-px flex-1 bg-black/15" />
          <span>Money Manager</span>
          <span className="h-px flex-1 bg-black/15" />
        </div>
      </div>
    </main>
  )
}
