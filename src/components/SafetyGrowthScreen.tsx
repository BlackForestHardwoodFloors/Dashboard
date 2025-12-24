import React from 'react';
import { Shield, TrendingUp } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function SafetyGrowthScreen() {
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
        margin: '0 auto'
      }}>
        <h1 style={{
          color: colors.text,
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 24px 0'
        }}>
          Safety & Growth
        </h1>

        {/* Safety Section */}
        <div style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: colors.successLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={24} color={colors.success} />
            </div>
            <div>
              <h2 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Safety Training
              </h2>
              <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '2px 0 0 0' }}>
                3 modules completed
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ color: colors.textSecondary, fontSize: '12px' }}>Progress</span>
            <span style={{ color: colors.success, fontSize: '12px', fontWeight: '700' }}>75%</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: colors.backgroundTertiary,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '75%',
              height: '100%',
              backgroundColor: colors.success,
              borderRadius: '4px'
            }} />
          </div>
        </div>

        {/* Growth Section */}
        <div style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '16px',
          padding: '20px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: colors.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color={colors.accent} />
            </div>
            <div>
              <h2 style={{ color: colors.text, fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Career Growth
              </h2>
              <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '2px 0 0 0' }}>
                Level 2 Installer
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: colors.backgroundTertiary,
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ color: colors.accent, fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>
                127
              </p>
              <p style={{ color: colors.textSecondary, fontSize: '11px', margin: 0 }}>
                Jobs Completed
              </p>
            </div>
            <div style={{
              backgroundColor: colors.backgroundTertiary,
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ color: colors.warning, fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>
                4.8
              </p>
              <p style={{ color: colors.textSecondary, fontSize: '11px', margin: 0 }}>
                Avg Rating
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
