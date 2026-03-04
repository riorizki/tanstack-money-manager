import { Component } from 'react'
import { RootErrorPage } from './RootErrorPage'

import type { ErrorInfo, ReactNode } from 'react'

interface RootErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class RootErrorBoundary extends Component<
  { children: ReactNode },
  RootErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[RootErrorBoundary]', error, info)
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <RootErrorPage
          message={this.state.error?.message}
          onRetry={this.resetError}
        />
      )
    }

    return this.props.children
  }
}
