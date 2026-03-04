import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <section role="alert" className="border border-black px-8 py-16 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        ■ ERROR
      </p>
      <h2 className="mt-4 text-2xl font-bold">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-6 rounded-none border-black px-6 py-2 text-[11px] font-bold uppercase tracking-[0.16em] shadow-none hover:bg-black hover:text-white"
        >
          Retry
        </Button>
      )}
    </section>
  )
}
