import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Component, type ErrorInfo, type ReactNode } from 'react'

import { getSessionFn } from '@/features/auth/server/get-session'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import appCss from '../styles.css?url'

import type { AuthUser } from '@/features/auth/types'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
  user: AuthUser | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const user = await getSessionFn()
    return { user }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Money Manager' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

// --- Error Boundary ---

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-8">
          <div className="w-full max-w-md border border-black p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              ■ ERROR
            </p>
            <h1 className="mt-4 text-3xl font-bold">Something went wrong.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
              className="mt-6 w-full border border-black py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// --- Root Document ---

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <TanStackQueryProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
