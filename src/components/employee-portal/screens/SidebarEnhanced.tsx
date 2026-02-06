/**
 * Boardroom 360 Global Sidebar Navigation (ENFORCED)
 *
 * This is the single source of truth sidebar component.
 * - Keeps the original compact 3D pill button style (via Button + SideButton3D)
 * - Adds a working dropdown under "Settings" for mode switching (Admin/Employee/Customer)
 *
 * Replace in your repo:
 *   src/components/SidebarEnhanced.tsx
 */

import React, { useMemo, useState } from 'react';
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
  Settings as SettingsIcon,
  Bell,
  Search,
  Moon,
  LogOut,
  LayoutDashboard,
  HardHat,
  UserCog
} from 'lucide-react';

import { Button } from './Button';
import exampleImage from 'figma:asset/cc7e395c0962f7e0b1de8c14a8bdd7b3abb834b2.png';

export interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

/**
 * Named export (some pages import { SidebarEnhanced })
 */
export function SidebarEnhanced({
  activePage = 'Dashboard',
  onNavigate,
  darkMode = true,
  onToggleDarkMode
}: SidebarProps) {
  const menuItems = useMemo(
    () => [
      'Dashboard',
      'Calendar',
      'Clients',
      'Quotes',
      'Contracts',
      'Jobs',
      'Work Orders',
      'Time Sheet',
      'Messages',
      'Photos',
      'Items',
      'Vendors',
      'Reviews',
      'Settings'
    ],
    []
  );

  const [activeButton, setActiveButton] = useState(() => menuItems.indexOf(activePage));
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const bgColor = darkMode ? '#2D2D2D' : '#FFFFFF';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';

  // Simulated alerts (you can wire to real data later)
  const hasAlerts = true;

  const menuItemsConfig = useMemo(
    () => [
      { icon: Home, label: 'Dashboard', variant: 'dashboard' as const },
      { icon: Calendar, label: 'Calendar', variant: 'calendar' as const },
      { icon: UserCircle, label: 'Clients', variant: 'client' as const },
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
      { icon: SettingsIcon, label: 'Settings', variant: 'settings' as const }
    ],
    []
  );

  const handleClick = (index: number, label: string) => {
    setActiveButton(index);

    // ✅ Settings dropdown behavior
    if (label === 'Settings') {
      setSettingsExpanded((v) => !v);
      // Also navigate to Settings main page (keeps expected behavior)
      onNavigate?.('Settings');
      return;
    }

    // Collapse Settings dropdown when leaving settings
    if (settingsExpanded) setSettingsExpanded(false);

    onNavigate?.(label);
  };

  const SettingsSubButton = ({
    icon: Icon,
    label,
    path
  }: {
    icon: any;
    label: string;
    path: string;
  }) => {
    const isDark = !!darkMode;
    return (
      <button
        type="button"
        onClick={() => onNavigate?.(path)}
        style={{
          width: '100%',
          height: '30px',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#3D3D3D' : '#E5E5E5'}`,
          background: isDark ? '#1F1F1F' : '#F7F7F7',
          color: isDark ? '#EDEDED' : '#111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 700
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={16} />
          {label}
        </span>
        <span style={{ opacity: 0.8 }}>›</span>
      </button>
    );
  };

  return (
    <aside
      style={{
        width: '160px',
        backgroundColor: bgColor,
        borderRight: `1px solid ${borderColor}`,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100vh',
        overflowY: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Inline styles (kept from original file for alerts/bell glow) */}
      <style>{`
        .alert-bell {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #DC3545;
          box-shadow: 0 4px 16px rgba(220, 53, 69, 0.4);
          transition: all 0.3s ease;
        }
        .alert-bell:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(220, 53, 69, 0.6), 0 0 20px 8px rgba(220, 53, 69, 0.4);
        }
      `}</style>

      {/* Top utility row (kept as-is) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={() => onNavigate?.('Search')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            background: darkMode ? '#1F1F1F' : '#F7F7F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Search"
        >
          <Search size={18} color={darkMode ? '#EDEDED' : '#111'} />
        </button>

        <button
          type="button"
          onClick={() => onToggleDarkMode?.()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            background: darkMode ? '#1F1F1F' : '#F7F7F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Toggle dark mode"
        >
          <Moon size={18} color={darkMode ? '#EDEDED' : '#111'} />
        </button>

        {/* Alert bell */}
        <button
          type="button"
          className="alert-bell"
          onClick={() => onNavigate?.('Alerts')}
          aria-label="Alerts"
        >
          <Bell size={18} color="#fff" />
          {hasAlerts && (
            <span
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 18,
                height: 18,
                borderRadius: 999,
                background: '#fff',
                color: '#DC3545',
                fontWeight: 900,
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              40
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('Logout')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            background: darkMode ? '#1F1F1F' : '#F7F7F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Logout"
        >
          <LogOut size={18} color={darkMode ? '#EDEDED' : '#111'} />
        </button>
      </div>

      {/* Hero image (kept from original file) */}
      <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: `1px solid ${borderColor}` }}>
        <img src={exampleImage} alt="Boardroom" style={{ width: '100%', display: 'block' }} />
      </div>

      {/* Main menu */}
      {menuItemsConfig.map((item, index) => (
        <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

          {/* ✅ Settings dropdown */}
          {item.label === 'Settings' && settingsExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 6 }}>
              <SettingsSubButton icon={LayoutDashboard} label="Admin Dashboard" path="Mode/Admin" />
              <SettingsSubButton icon={HardHat} label="Employee Portal" path="Mode/Employee" />
              <SettingsSubButton icon={UserCog} label="Customer Portal" path="Mode/Customer" />
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}

export default SidebarEnhanced;
