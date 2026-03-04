interface PageHeaderProps {
  section?: string
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ section, title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-10">
      {section && (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          <span className="mr-2 inline-block">■</span>
          {section}
        </p>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">
            {title}
            {!title.endsWith('.') && '.'}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
