import { Briefcase, Calendar, Shield, Camera } from 'lucide-react';

type Tab = 'safety';

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const GOLD = '#D4A024';
  const GOLD_HOVER = '#E5B035';
  const COMPANYCAM_BLUE = '#0F7BFF';
  
  const tabs = [
    { id: 'safety' as Tab, label: 'Safety & Growth', icon: Shield },
  ];

  return (
    <nav 
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A1A1A',
        borderTop: '1px solid #2A2A2A',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.3)'
      }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minHeight: '68px',
                position: 'relative',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid ${GOLD}`;
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div 
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: '3px',
                    backgroundColor: GOLD,
                    borderRadius: '0 0 3px 3px'
                  }} 
                />
              )}
              
              <Icon 
                aria-hidden="true"
                size={28} 
                color={isActive ? GOLD : '#808080'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              <span style={{
                fontSize: '12px',
                fontWeight: isActive ? '700' : '600',
                color: isActive ? GOLD : '#808080',
                textAlign: 'center',
                lineHeight: '1.2'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Safe area padding for mobile devices */}
      <div style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  );
}