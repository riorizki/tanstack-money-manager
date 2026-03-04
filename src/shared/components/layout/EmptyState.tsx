interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border border-black px-8 py-16 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        ■ EMPTY
      </p>
      <h2 className="mt-4 text-2xl font-bold">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
