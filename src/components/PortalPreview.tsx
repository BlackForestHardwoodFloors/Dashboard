import React, { useState } from 'react';
import { EmployeePortal } from './EmployeePortal';
// import { CustomerPortal } from './CustomerPortal'; // Uncomment when available
import { ThemeProvider, useTheme, ThemeToggle } from './ThemeProvider';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Users, 
  Briefcase,
  Eye,
  Layout,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';

type PortalType = 'employee' | 'customer';
type DeviceType = 'desktop' | 'tablet' | 'mobile';
type ViewMode = 'single' | 'split';

const deviceSizes: Record<DeviceType, { width: number; height: number; label: string }> = {
  mobile: { width: 390, height: 844, label: 'iPhone 14 Pro' },
  tablet: { width: 820, height: 1180, label: 'iPad Air' },
  desktop: { width: 1280, height: 800, label: 'Desktop' }
};

function PortalPreviewInner() {
  const { colors, resolvedTheme } = useTheme();
  const [activePortal, setActivePortal] = useState<PortalType>('employee');
  const [device, setDevice] = useState<DeviceType>('mobile');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  const currentDevice = deviceSizes[device];

  // Calculate scale to fit viewport
  const calculateScale = () => {
    const maxHeight = window.innerHeight - 200;
    const maxWidth = viewMode === 'split' ? (window.innerWidth - 100) / 2 : window.innerWidth - 100;
    
    const scaleX = maxWidth / currentDevice.width;
    const scaleY = maxHeight / currentDevice.height;
    
    return Math.min(scaleX, scaleY, 1);
  };

  React.useEffect(() => {
    const handleResize = () => setScale(calculateScale());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [device, viewMode]);

  const DeviceFrame = ({ portal, showLabel = true }: { portal: PortalType; showLabel?: boolean }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      {showLabel && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: portal === 'employee' ? colors.accentLight : colors.successLight,
          borderRadius: '20px'
        }}>
          {portal === 'employee' ? (
            <Briefcase size={16} color={colors.accent} />
          ) : (
            <Users size={16} color={colors.success} />
          )}
          <span style={{ 
            color: portal === 'employee' ? colors.accent : colors.success,
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {portal === 'employee' ? 'Employee Portal' : 'Customer Portal'}
          </span>
        </div>
      )}
      
      {/* Device Frame */}
      <div style={{
        width: currentDevice.width * scale,
        height: currentDevice.height * scale,
        backgroundColor: '#000',
        borderRadius: device === 'mobile' ? '40px' : device === 'tablet' ? '20px' : '8px',
        padding: device === 'mobile' ? '12px' : device === 'tablet' ? '16px' : '4px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Notch for mobile */}
        {device === 'mobile' && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '28px',
            backgroundColor: '#000',
            borderRadius: '20px',
            zIndex: 10
          }} />
        )}
        
        {/* Screen */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: device === 'mobile' ? '32px' : device === 'tablet' ? '12px' : '4px',
          overflow: 'hidden',
          backgroundColor: colors.background
        }}>
          <div style={{
            width: currentDevice.width,
            height: currentDevice.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            overflow: 'auto'
          }}>
            {portal === 'employee' ? (
              <EmployeePortal />
            ) : (
              // Customer Portal placeholder
              <div style={{
                minHeight: '100vh',
                backgroundColor: colors.background,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
              }}>
                <Users size={64} color={colors.textTertiary} />
                <h2 style={{ color: colors.text, marginTop: '20px' }}>Customer Portal</h2>
                <p style={{ color: colors.textSecondary, textAlign: 'center' }}>
                  Import your CustomerPortal component to preview it here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Device Label */}
      <span style={{ color: colors.textTertiary, fontSize: '11px' }}>
        {currentDevice.label} ({currentDevice.width} × {currentDevice.height})
      </span>
    </div>
  );

  if (isFullscreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.background,
        zIndex: 99999
      }}>
        <button
          onClick={() => setIsFullscreen(false)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px',
            backgroundColor: colors.backgroundSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            color: colors.text,
            cursor: 'pointer',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Minimize2 size={18} />
          Exit Fullscreen
        </button>
        {activePortal === 'employee' ? (
          <EmployeePortal />
        ) : (
          <div style={{
            minHeight: '100vh',
            backgroundColor: colors.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ color: colors.textSecondary }}>Customer Portal not yet imported</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      transition: 'background-color 0.3s'
    }}>
      {/* Toolbar */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        zIndex: 1000,
        flexWrap: 'wrap'
      }}>
        {/* Left: Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Eye size={20} color={colors.accent} />
          <span style={{ color: colors.text, fontSize: '16px', fontWeight: '700' }}>
            Portal Preview
          </span>
        </div>

        {/* Center: Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Portal Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: colors.backgroundTertiary,
            borderRadius: '10px',
            padding: '4px'
          }}>
            <button
              onClick={() => setActivePortal('employee')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activePortal === 'employee' ? colors.accent : 'transparent',
                color: activePortal === 'employee' ? '#FFF' : colors.textSecondary,
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Briefcase size={14} />
              Employee
            </button>
            <button
              onClick={() => setActivePortal('customer')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activePortal === 'customer' ? colors.success : 'transparent',
                color: activePortal === 'customer' ? '#FFF' : colors.textSecondary,
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={14} />
              Customer
            </button>
          </div>

          {/* Device Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: colors.backgroundTertiary,
            borderRadius: '10px',
            padding: '4px'
          }}>
            {[
              { type: 'mobile' as DeviceType, icon: Smartphone },
              { type: 'tablet' as DeviceType, icon: Tablet },
              { type: 'desktop' as DeviceType, icon: Monitor }
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setDevice(type)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: device === type ? colors.accent : 'transparent',
                  color: device === type ? '#FFF' : colors.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div style={{
            display: 'flex',
            backgroundColor: colors.backgroundTertiary,
            borderRadius: '10px',
            padding: '4px'
          }}>
            <button
              onClick={() => setViewMode('single')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'single' ? colors.accent : 'transparent',
                color: viewMode === 'single' ? '#FFF' : colors.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
              }}
            >
              <Monitor size={14} />
              Single
            </button>
            <button
              onClick={() => setViewMode('split')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'split' ? colors.accent : 'transparent',
                color: viewMode === 'split' ? '#FFF' : colors.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
              }}
            >
              <Layout size={14} />
              Split
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
          
          <button
            onClick={() => setIsFullscreen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.backgroundSecondary,
              color: colors.text,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Maximize2 size={14} />
            Fullscreen
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div style={{
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {viewMode === 'single' ? (
          <DeviceFrame portal={activePortal} />
        ) : (
          <>
            <DeviceFrame portal="employee" />
            <DeviceFrame portal="customer" />
          </>
        )}
      </div>

      {/* Help Text */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: colors.backgroundSecondary,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: `0 4px 20px ${colors.shadow}`
      }}>
        <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
          💡 Tip: Use <strong>Fullscreen</strong> to test the real experience, or <strong>Split</strong> to compare both portals
        </span>
      </div>
    </div>
  );
}

export function PortalPreview() {
  return (
    <ThemeProvider defaultTheme="system">
      <PortalPreviewInner />
    </ThemeProvider>
  );
}

// Also export a simpler version for quick testing
export function QuickPreview({ portal = 'employee' }: { portal?: 'employee' | 'customer' }) {
  return (
    <ThemeProvider defaultTheme="system">
      {portal === 'employee' ? <EmployeePortal /> : (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Customer Portal not imported
        </div>
      )}
    </ThemeProvider>
  );
}
