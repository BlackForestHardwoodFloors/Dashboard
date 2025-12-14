import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log the error for debugging
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Show a simple error message instead of trying to render broken children
      return (
        <div style={{
          padding: '24px',
          backgroundColor: '#FEE',
          border: '2px solid #F88',
          borderRadius: '8px',
          margin: '24px'
        }}>
          <h2 style={{ color: '#C00', marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: '8px' }}>
            {this.state.error?.message || 'An unknown error occurred'}
          </p>
          <details style={{ marginTop: '12px' }}>
            <summary style={{ cursor: 'pointer', color: '#666' }}>Error details</summary>
            <pre style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#FFF',
              border: '1px solid #DDD',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}