/**
 * Boardroom 360 Global Sidebar Navigation
 * 
 * This sidebar appears on all pages with consistent styling and navigation
 */

import { useState } from 'react';
import { 
  Home, 
  Calendar, 
  UserCircle, 
  FileText, 
  FileSignature,
  ClipboardList, 
  Briefcase, 
  Clock3, 
  MessageSquare, 
  Camera,
  Package, 
  Building2, 
  Star, 
  Settings,
  Search,
  Bell,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from './Button';

import exampleImage from 'figma:asset/cc7e395c0962f7e0b1de8c14a8bdd7b3abb834b2.png';

interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Sidebar({ activePage = 'Dashboard', onNavigate, darkMode = true, onToggleDarkMode }: SidebarProps) {
  const [activeButton, setActiveButton] = useState(() => {
    const menuItems = [
      'Dashboard', 'Calendar', 'Client', 'Quotes', 'Contracts', 
      'Jobs', 'Work Orders', 'Time Sheet', 'Messages', 'Photos', 
      'Items', 'Vendors', 'Reviews', 'Settings'
    ];
    return menuItems.indexOf(activePage);
  });

  const bgColor = darkMode ? '#2D2D2D' : '#FFFFFF';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';

  // Simulate having alerts - you can make this a prop later
  const hasAlerts = true;

  const menuItemsConfig = [
    { icon: Home, label: 'Dashboard', variant: 'dashboard' as const },
    { icon: Calendar, label: 'Calendar', variant: 'calendar' as const },
    { icon: UserCircle, label: 'Client', variant: 'client' as const },
    { icon: FileText, label: 'Quotes', variant: 'quotes' as const },
    { icon: FileSignature, label: 'Contracts', variant: 'contracts' as const },
    { icon: ClipboardList, label: 'Jobs', variant: 'jobs' as const },
    { icon: Briefcase, label: 'Work Orders', variant: 'workOrders' as const },
    { icon: Clock3, label: 'Time Sheet', variant: 'timeSheet' as const },
    { icon: MessageSquare, label: 'Messages', variant: 'messages' as const },
    { icon: Camera, label: 'Photos', variant: 'photos' as const },
    { icon: Package, label: 'Items', variant: 'items' as const },
    { icon: Building2, label: 'Vendors', variant: 'vendors' as const },
    { icon: Star, label: 'Reviews', variant: 'reviews' as const },
    { icon: Settings, label: 'Settings', variant: 'settings' as const }
  ];

  const handleClick = (index: number, label: string) => {
    setActiveButton(index);
    if (onNavigate) {
      onNavigate(label);
    }
  };

  return (
    <aside style={{
      width: '160px',
      backgroundColor: bgColor,
      borderRight: `1px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: '140px 12px 24px 12px',
      gap: '8px',
      overflowY: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000
    }}>
      {/* Keyframe animations for bell pulsation */}
      <style>{`
        @keyframes bellPulsate {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4), 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 4px 16px rgba(220, 53, 69, 0.6), 0 0 20px 8px rgba(220, 53, 69, 0.4);
          }
        }
      `}</style>

      {/* Red Notification Bell - Above Utility Buttons */}
      <div style={{
        position: 'absolute',
        top: '42px',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <button style={{
          width: '56px',
          height: '56px',
          backgroundColor: '#DC3545',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
          animation: hasAlerts ? 'bellPulsate 2s ease-in-out infinite' : 'none'
        }}>
          <Bell style={{ width: '28px', height: '28px', color: '#FFFFFF' }} />
          {/* Notification Badge */}
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            backgroundColor: '#FFFFFF',
            color: '#DC3545',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            border: '2px solid #DC3545'
          }}>
            40
          </div>
        </button>
      </div>

      {/* Top Icons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${borderColor}`
      }}>
        {/* Search Button */}
        <button style={{
          flex: 1,
          height: '40px',
          backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
          border: `1px solid ${borderColor}`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Search style={{ width: '18px', height: '18px', color: darkMode ? '#FFFFFF' : '#1A1A1A' }} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          style={{
            flex: 1,
            height: '40px',
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            border: `1px solid ${borderColor}`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {darkMode ? (
            <Moon style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
          ) : (
            <Sun style={{ width: '18px', height: '18px', color: '#1A1A1A' }} />
          )}
        </button>
      </div>

      {menuItemsConfig.map((item, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <Button
            variant={item.variant}
            size="sidebar"
            fullWidth
            icon={<item.icon />}
            onClick={() => handleClick(index, item.label)}
            isActive={activeButton === index}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </aside>
  );
}