/**
 * Boardroom 360 Enhanced Sidebar Navigation
 * 
 * Features:
 * - Expandable dropdown sub-menus
 * - Role-based menu visibility
 * - Dark/Light mode support
 * - Mobile responsive
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
  Clock, 
  MessageSquare, 
  Camera,
  Package, 
  Building2, 
  Star, 
  Settings,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Users,
  MapPin,
  Truck,
  Paperclip,
  FileCheck,
  FileMinus,
  FileX,
  Send,
  Play,
  CheckCircle,
  DollarSign,
  BarChart3,
  Shield,
  Receipt,
  Building,
  Contact,
  ListOrdered
} from 'lucide-react';

interface SubMenuItem {
  label: string;
  icon: any;
  path: string;
}

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  subItems?: SubMenuItem[];
}

interface SidebarEnhancedProps {
  activePage?: string;
  onNavigate?: (page: string, subPage?: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  userRole?: 'admin' | 'manager' | 'member';
}

export function SidebarEnhanced({ 
  activePage = 'Dashboard', 
  onNavigate, 
  darkMode = true, 
  onToggleDarkMode,
  userRole = 'admin'
}: SidebarEnhancedProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState(activePage);

  const bgColor = darkMode ? '#2D2D2D' : '#FFFFFF';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const hoverBg = darkMode ? '#3D3D3D' : '#F5F5F5';
  const activeBg = darkMode ? '#4A3728' : '#FFF3E0';
  const accentColor = '#D4A024';

  // Menu configuration matching your backend structure
  const menuConfig: MenuItem[] = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: 'Dashboard'
    },
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      path: 'Messages'
    },
    { 
      icon: UserCircle, 
      label: 'Clients', 
      path: 'Clients',
      subItems: [
        { label: 'All Clients', icon: Users, path: 'Clients' },
        { label: 'Contractors', icon: Building, path: 'Clients/Contractors' },
        { label: 'Locations', icon: MapPin, path: 'Clients/Locations' },
        { label: 'Company', icon: Building2, path: 'Clients/Company' }
      ]
    },
    { 
      icon: Calendar, 
      label: 'Appointments', 
      path: 'Calendar',
      subItems: [
        { label: 'All Appointments', icon: Calendar, path: 'Calendar' },
        { label: 'On Site Visits', icon: MapPin, path: 'Calendar/SiteVisits' },
        { label: 'Scheduled Jobs', icon: Clock, path: 'Calendar/ScheduledJobs' },
        { label: 'Wood Delivery', icon: Truck, path: 'Calendar/WoodDelivery' },
        { label: 'Attachments', icon: Paperclip, path: 'Calendar/Attachments' }
      ]
    },
    { 
      icon: FileText, 
      label: 'Quotes', 
      path: 'Quotes',
      subItems: [
        { label: 'All Quotes', icon: FileText, path: 'Quotes' },
        { label: 'Quotes Draft', icon: FileMinus, path: 'Quotes/Draft' },
        { label: 'Quotes Sent', icon: Send, path: 'Quotes/Sent' },
        { label: 'Quotes Accepted', icon: FileCheck, path: 'Quotes/Accepted' },
        { label: 'Quotes Rejected', icon: FileX, path: 'Quotes/Rejected' }
      ]
    },
    { 
      icon: FileSignature, 
      label: 'Contracts', 
      path: 'Contracts',
      subItems: [
        { label: 'All Contracts', icon: FileSignature, path: 'Contracts' },
        { label: 'Contracts Sent', icon: Send, path: 'Contracts/Sent' },
        { label: 'Contracts Signed', icon: FileCheck, path: 'Contracts/Signed' }
      ]
    },
    { 
      icon: Briefcase, 
      label: 'Work Orders', 
      path: 'WorkOrders'
    },
    { 
      icon: ClipboardList, 
      label: 'Jobs', 
      path: 'Jobs',
      subItems: [
        { label: 'All Jobs', icon: ClipboardList, path: 'Jobs' },
        { label: 'Ready To Start', icon: Play, path: 'Jobs/ReadyToStart' },
        { label: 'Jobs In Progress', icon: Clock, path: 'Jobs/InProgress' },
        { label: 'Jobs Completed', icon: CheckCircle, path: 'Jobs/Completed' }
      ]
    },
    { 
      icon: Camera, 
      label: 'Photos', 
      path: 'Photos'
    },
    { 
      icon: Clock, 
      label: 'Timesheet', 
      path: 'Time Sheet',
      subItems: userRole === 'admin' || userRole === 'manager' ? [
        { label: 'Time Logs', icon: Clock, path: 'Time Sheet' },
        { label: 'Wage Rate', icon: DollarSign, path: 'Time Sheet/WageRate' },
        { label: 'General Tasks', icon: ClipboardList, path: 'Time Sheet/GeneralTasks' },
        { label: 'Weekly Report', icon: BarChart3, path: 'Time Sheet/WeeklyReport' },
        { label: 'Payroll', icon: DollarSign, path: 'Time Sheet/Payroll' }
      ] : [
        { label: 'Time Logs', icon: Clock, path: 'Time Sheet' }
      ]
    },
    { 
      icon: Package, 
      label: 'Items', 
      path: 'Items'
    },
    { 
      icon: Building2, 
      label: 'Vendors', 
      path: 'Vendors',
      subItems: [
        { label: 'Vendor Company', icon: Building2, path: 'Vendors' },
        { label: 'Vendor Contacts', icon: Contact, path: 'Vendors/Contacts' },
        { label: 'Vendor Price List', icon: ListOrdered, path: 'Vendors/PriceList' }
      ]
    },
    { 
      icon: Star, 
      label: 'Reviews', 
      path: 'Reviews'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: 'Settings',
      subItems: userRole === 'admin' ? [
        { label: 'Employees', icon: Users, path: 'Settings/Employees' },
        { label: 'Departments', icon: Building, path: 'Settings/Departments' },
        { label: 'Roles & Permissions', icon: Shield, path: 'Settings/Roles' },
        { label: 'Taxes', icon: Receipt, path: 'Settings/Taxes' }
      ] : undefined
    }
  ];

  const toggleExpand = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleClick = (path: string, label: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      toggleExpand(label);
    } else {
      setActiveItem(path);
      if (onNavigate) {
        onNavigate(path);
      }
    }
  };

  const handleSubItemClick = (path: string) => {
    setActiveItem(path);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const isActive = (path: string) => activeItem === path || activeItem.startsWith(path + '/');

  return (
    <aside style={{
      width: '220px',
      backgroundColor: bgColor,
      borderRight: `1px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '100px 12px 24px 12px',
      gap: '4px',
      overflowY: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000
    }}>
      {/* Keyframe animations */}
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
        .sidebar-item:hover {
          background-color: ${hoverBg};
        }
        .sidebar-item.active {
          background-color: ${activeBg};
          border-left: 3px solid ${accentColor};
        }
        .sub-item:hover {
          background-color: ${hoverBg};
        }
      `}</style>

      {/* Notification Bell */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <button style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#DC3545',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
          animation: 'bellPulsate 2s ease-in-out infinite'
        }}>
          <Bell style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#FFFFFF',
            color: '#DC3545',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            border: '2px solid #DC3545'
          }}>
            12
          </div>
        </button>
      </div>

      {/* Top Icons Row */}
      <div style={{
        display: 'flex',
        gap: '8px',
        paddingBottom: '16px',
        marginBottom: '8px',
        borderBottom: `1px solid ${borderColor}`
      }}>
        <button style={{
          flex: 1,
          height: '36px',
          backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Search style={{ width: '16px', height: '16px', color: textColor }} />
        </button>
        <button
          onClick={onToggleDarkMode}
          style={{
            flex: 1,
            height: '36px',
            backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {darkMode ? (
            <Moon style={{ width: '16px', height: '16px', color: textColor }} />
          ) : (
            <Sun style={{ width: '16px', height: '16px', color: textColor }} />
          )}
        </button>
      </div>

      {/* Menu Items */}
      {menuConfig.map((item, index) => {
        const Icon = item.icon;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenus.includes(item.label);
        const itemIsActive = isActive(item.path);

        return (
          <div key={index}>
            {/* Main Menu Item */}
            <button
              className={`sidebar-item ${itemIsActive ? 'active' : ''}`}
              onClick={() => handleClick(item.path, item.label, !!hasSubItems)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: itemIsActive ? activeBg : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: itemIsActive ? `3px solid ${accentColor}` : '3px solid transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon style={{ 
                  width: '18px', 
                  height: '18px', 
                  color: itemIsActive ? accentColor : textMuted 
                }} />
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: itemIsActive ? '600' : '500',
                  color: itemIsActive ? textColor : textMuted
                }}>
                  {item.label}
                </span>
              </div>
              {hasSubItems && (
                isExpanded 
                  ? <ChevronDown style={{ width: '14px', height: '14px', color: textMuted }} />
                  : <ChevronRight style={{ width: '14px', height: '14px', color: textMuted }} />
              )}
            </button>

            {/* Sub Menu Items */}
            {hasSubItems && isExpanded && (
              <div style={{
                marginLeft: '20px',
                marginTop: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                {item.subItems!.map((subItem, subIndex) => {
                  const SubIcon = subItem.icon;
                  const subIsActive = activeItem === subItem.path;
                  
                  return (
                    <button
                      key={subIndex}
                      className="sub-item"
                      onClick={() => handleSubItemClick(subItem.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        backgroundColor: subIsActive ? activeBg : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderLeft: subIsActive ? `2px solid ${accentColor}` : '2px solid transparent'
                      }}
                    >
                      <SubIcon style={{ 
                        width: '14px', 
                        height: '14px', 
                        color: subIsActive ? accentColor : textMuted 
                      }} />
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: subIsActive ? '600' : '400',
                        color: subIsActive ? textColor : textMuted
                      }}>
                        {subItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
