import React, { useEffect, useState } from 'react';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Verify all critical dependencies are available
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      if (typeof document === 'undefined') {
        throw new Error('Document object not available');
      }

      // Mark as ready
      setIsReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Bootstrap error:', err);
    }
  }, []);

  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#FEE',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <h1 style={{ color: '#C00', marginBottom: '16px' }}>
            Failed to Initialize App
          </h1>
          <p style={{ color: '#666' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #E0E0E0',
            borderTop: '4px solid #4A90E2',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
