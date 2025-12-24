import React from 'react';
import { Calendar } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function CalendarScreen() {
  const { colors } = useTheme();
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '20px',
      paddingTop: 'max(20px, env(safe-area-inset-top))',
      paddingBottom: '100px',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
        paddingTop: '60px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: colors.backgroundSecondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Calendar size={40} color={colors.success} />
        </div>
        <h2 style={{
          color: colors.text,
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 8px 0'
        }}>
          Calendar
        </h2>
        <p style={{
          color: colors.textTertiary,
          fontSize: '15px',
          margin: 0
        }}>
          Coming soon
        </p>
      </div>
    </div>
  );
}
