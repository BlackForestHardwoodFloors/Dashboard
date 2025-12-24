import { Camera, Briefcase, Image as ImageIcon, MessageSquare, User } from 'lucide-react';
import { useTheme } from './ThemeProvider';

type Tab = 'jobs' | 'photos' | 'messages' | 'me';

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onCameraPress?: () => void;
  unreadMessages?: number;
}

export function BottomNavigation({ activeTab, onTabChange, onCameraPress, unreadMessages = 0 }: BottomNavigationProps) {
  const { colors, employeeColor } = useTheme();

  const NavButton = ({ tab, icon: Icon, label, badge }: { tab: Tab; icon: any; label: string; badge?: number }) => (
    <button
      onClick={() => onTabChange(tab)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        padding: '6px 12px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        flex: 1,
        minWidth: 0,
        position: 'relative'
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        backgroundColor: activeTab === tab ? `${employeeColor}20` : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <Icon 
          size={20} 
          color={activeTab === tab ? employeeColor : colors.textTertiary} 
          strokeWidth={activeTab === tab ? 2.5 : 2}
        />
        {badge && badge > 0 && (
          <div style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            minWidth: '16px',
            height: '16px',
            borderRadius: '8px',
            backgroundColor: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: '700',
            color: '#FFFFFF',
            padding: '0 4px'
          }}>
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>
      <span style={{
        fontSize: '10px',
        fontWeight: activeTab === tab ? '700' : '500',
        color: activeTab === tab ? employeeColor : colors.textTertiary,
        whiteSpace: 'nowrap'
      }}>
        {label}
      </span>
    </button>
  );
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.backgroundSecondary,
      borderTop: `1px solid ${colors.border}`,
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      zIndex: 1000,
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        padding: '6px 8px'
      }}>
        <NavButton tab="jobs" icon={Briefcase} label="Jobs" />
        <NavButton tab="photos" icon={ImageIcon} label="Photos" />

        {/* Center Camera Button */}
        <button
          onClick={onCameraPress}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '0',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginTop: '-24px'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: employeeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 16px ${employeeColor}66`,
            border: `4px solid ${colors.backgroundSecondary}`,
            transition: 'background-color 0.3s ease'
          }}>
            <Camera size={24} color="#FFFFFF" strokeWidth={2.5} />
          </div>
        </button>

        <NavButton tab="messages" icon={MessageSquare} label="Messages" badge={unreadMessages} />
        <NavButton tab="me" icon={User} label="Me" />
      </div>
    </div>
  );
}
