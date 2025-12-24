/**
 * Boardroom 360 Enhanced Sidebar Navigation
 * 
 * Features:
 * - Expandable dropdown sub-menus
 * - 3D Plastic button styling matching Figma Make design
 * - Role-based menu visibility
 * - Dark/Light mode support
 * - Mobile responsive
 */

import { useState, useRef, useEffect, ReactNode } from 'react';
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
  Radio,
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
  ListOrdered,
  UserCog,
  HardHat,
  LayoutDashboard
} from 'lucide-react';
import { createPortal } from 'react-dom';

// Tooltip component that renders outside the sidebar using portal
function TooltipPortal({ 
  children, 
  content, 
  position = 'right' 
}: { 
  children: ReactNode; 
  content: string; 
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = rect.left + rect.width / 2;
          y = rect.top - 12;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2;
          y = rect.bottom + 12;
          break;
        case 'left':
          x = rect.left - 12;
          y = rect.top + rect.height / 2;
          break;
        case 'right':
          x = rect.right + 12;
          y = rect.top + rect.height / 2;
          break;
      }

      setCoords({ x, y });
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const getTransform = () => {
    switch (position) {
      case 'top': return 'translateX(-50%) translateY(-100%)';
      case 'bottom': return 'translateX(-50%)';
      case 'left': return 'translateX(-100%) translateY(-50%)';
      case 'right': return 'translateY(-50%)';
    }
  };

  const getArrowStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };
    switch (position) {
      case 'top':
        return { ...base, bottom: -8, left: '50%', transform: 'translateX(-50%)', borderWidth: '8px 8px 0 8px', borderColor: '#D4A024 transparent transparent transparent' };
      case 'bottom':
        return { ...base, top: -8, left: '50%', transform: 'translateX(-50%)', borderWidth: '0 8px 8px 8px', borderColor: 'transparent transparent #D4A024 transparent' };
      case 'left':
        return { ...base, right: -8, top: '50%', transform: 'translateY(-50%)', borderWidth: '8px 0 8px 8px', borderColor: 'transparent transparent transparent #D4A024' };
      case 'right':
        return { ...base, left: -8, top: '50%', transform: 'translateY(-50%)', borderWidth: '8px 8px 8px 0', borderColor: 'transparent #D4A024 transparent transparent' };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            left: coords.x,
            top: coords.y,
            transform: getTransform(),
            zIndex: 99999,
            pointerEvents: 'none',
            animation: 'tooltipFadeIn 0.2s ease-out',
          }}
        >
          <style>{`
            @keyframes tooltipFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          <div style={{
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1.4,
            textAlign: 'center',
            border: '2px solid #D4A024',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
            position: 'relative',
          }}>
            {content}
            <div style={getArrowStyles()} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// Color sets matching the Figma Make button-plastic component
const colorSets: Record<string, { base: string; highlight: string; shadow: string; hover: string; active: string }> = {
  dashboard: {
    base: '#D4A024',
    highlight: '#EFCB5A',
    shadow: '#A8801C',
    hover: '#E2B542',
    active: '#AF861C'
  },
  calendar: {
    base: '#3B9CAA',
    highlight: '#62C6D4',
    shadow: '#2A727D',
    hover: '#4FB6C3',
    active: '#26717A'
  },
  client: {
    base: '#7BAA8E',
    highlight: '#A7D2B8',
    shadow: '#5F846C',
    hover: '#8CC3A6',
    active: '#557A63'
  },
  quotes: {
    base: '#6E8B3D',
    highlight: '#9FBD63',
    shadow: '#4F6830',
    hover: '#82A64F',
    active: '#485E2C'
  },
  contracts: {
    base: '#4F6A41',
    highlight: '#7B9F6C',
    shadow: '#384D2F',
    hover: '#628053',
    active: '#324227'
  },
  jobs: {
    base: '#55624C',
    highlight: '#7B8F73',
    shadow: '#3D4737',
    hover: '#687C61',
    active: '#374133'
  },
  workOrders: {
    base: '#4A7268',
    highlight: '#6FA096',
    shadow: '#35554E',
    hover: '#5C8C7E',
    active: '#2F4B45'
  },
  timeSheet: {
    base: '#D76A6A',
    highlight: '#F1A3A3',
    shadow: '#A84C4C',
    hover: '#E57C7C',
    active: '#9A4545'
  },
  messages: {
    base: '#8A6E8C',
    highlight: '#B69DB8',
    shadow: '#6A536C',
    hover: '#9D80A0',
    active: '#5E4A5F'
  },
  commHub: {
    base: '#5C6BC0',
    highlight: '#8E99E8',
    shadow: '#3F4B99',
    hover: '#7986D4',
    active: '#3A4590'
  },
  photos: {
    base: '#0F7BFF',
    highlight: '#5BA7FF',
    shadow: '#0A4EB2',
    hover: '#2A8FFF',
    active: '#0A46A5'
  },
  items: {
    base: '#6B6D5E',
    highlight: '#93968A',
    shadow: '#52544A',
    hover: '#838671',
    active: '#565749'
  },
  vendors: {
    base: '#6B6456',
    highlight: '#938B7A',
    shadow: '#534D42',
    hover: '#83795C',
    active: '#565048'
  },
  reviews: {
    base: '#D4A024',
    highlight: '#EFCB5A',
    shadow: '#A8801C',
    hover: '#E2B542',
    active: '#AF861C'
  },
  settings: {
    base: '#78909C',
    highlight: '#A0BCC9',
    shadow: '#5E717C',
    hover: '#8FA8B3',
    active: '#61757F'
  },
  subItem: {
    base: '#4A4A4A',
    highlight: '#6A6A6A',
    shadow: '#2A2A2A',
    hover: '#5A5A5A',
    active: '#3A3A3A'
  }
};

interface SubMenuItem {
  label: string;
  icon: any;
  path: string;
}

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  colorKey: string;
  subItems?: SubMenuItem[];
}

interface SidebarEnhancedProps {
  activePage?: string;
  onNavigate?: (page: string, subPage?: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  userRole?: 'admin' | 'manager' | 'member' | 'employee';
}

// 3D Plastic Button Component matching Figma Make style
function PlasticButton({ 
  colorKey, 
  icon: Icon, 
  label, 
  isActive, 
  onClick,
  hasDropdown,
  isExpanded,
  size = 'normal'
}: { 
  colorKey: string;
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  hasDropdown?: boolean;
  isExpanded?: boolean;
  size?: 'normal' | 'small';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const colors = colorSets[colorKey] || colorSets.settings;
  
  // Determine current state colors
  let currentBase = colors.base;
  if (isPressed) {
    currentBase = colors.active;
  } else if (isHovered) {
    currentBase = colors.hover;
  } else if (isActive) {
    currentBase = colors.hover;
  }

  // Create the plastic gradient effect
  const plasticGradient = isPressed
    ? `linear-gradient(to bottom, 
        ${colors.shadow} 0%, 
        ${currentBase} 20%, 
        ${currentBase} 100%)`
    : `linear-gradient(to bottom, 
        ${colors.highlight} 0%, 
        ${currentBase} 30%, 
        ${currentBase} 70%, 
        ${colors.shadow} 100%)`;

  // Glossy reflection overlay
  const glossIntensity = isPressed ? 0.15 : (isHovered ? 0.35 : 0.25);
  const glossOverlay = `linear-gradient(to bottom,
    rgba(255, 255, 255, ${glossIntensity}) 0%,
    rgba(255, 255, 255, ${glossIntensity * 0.6}) 25%,
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0) 100%)`;

  // Box shadows for depth
  const outerShadow = (isPressed || isActive)
    ? `0 1px 2px rgba(0, 0, 0, 0.2)`
    : isHovered
    ? `0 6px 16px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15)`
    : `0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.12)`;

  const innerShadow = (isPressed || isActive)
    ? `inset 0 3px 8px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(0, 0, 0, 0.3)`
    : `inset 0 -1px 1px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.3)`;

  const height = size === 'small' ? 28 : 34;
  const fontSize = size === 'small' ? 11 : 13;
  const iconSize = size === 'small' ? 14 : 16;
  const borderRadius = size === 'small' ? 6 : 8;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        position: 'relative',
        width: '100%',
        height,
        padding: '0 12px',
        fontSize,
        fontWeight: 600,
        color: 'white',
        border: 'none',
        borderRadius,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        background: plasticGradient,
        boxShadow: `${outerShadow}, ${innerShadow}`,
        transition: 'all 0.15s ease-out',
        transform: (isPressed || isActive) ? 'translateY(2px) scale(0.98)' : 'translateY(0) scale(1)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Glossy overlay layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: glossOverlay,
          borderRadius,
          pointerEvents: 'none',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10,
        flex: 1
      }}>
        <div style={{ 
          width: iconSize, 
          height: iconSize, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon style={{ width: iconSize, height: iconSize }} />
        </div>
        <span style={{ textAlign: 'left', flex: 1 }}>{label}</span>
      </div>
      
      {/* Dropdown arrow */}
      {hasDropdown && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {isExpanded 
            ? <ChevronDown style={{ width: 14, height: 14 }} />
            : <ChevronRight style={{ width: 14, height: 14 }} />
          }
        </div>
      )}
    </button>
  );
}

export function SidebarEnhanced({ 
  activePage = 'Dashboard', 
  onNavigate, 
  darkMode = true, 
  onToggleDarkMode,
  userRole
}: SidebarEnhancedProps) {
  // Auto-detect role from localStorage if not provided
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const detectedRole = storedUser ? (JSON.parse(storedUser).portalType === 'employee' ? 'employee' : 'admin') : 'admin';
  const effectiveRole = userRole || detectedRole;

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState(activePage);

  const bgColor = darkMode ? '#2D2D2D' : '#FFFFFF';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';

  // Simulate having alerts - you can make this a prop later
  const hasAlerts = true;

  // Menu configuration matching your backend structure with Figma Make colors
  const menuConfig: MenuItem[] = [
    { icon: Home, label: 'Dashboard', path: 'Dashboard', colorKey: 'dashboard' },
    { icon: MessageSquare, label: 'Messages', path: 'Messages', colorKey: 'messages' },
    { icon: Radio, label: 'Comm Hub', path: 'Communication Hub', colorKey: 'commHub' },
    { 
      icon: UserCircle, 
      label: 'Clients', 
      path: 'Clients',
      colorKey: 'client',
      subItems: [
        { label: 'Contractors', icon: Building, path: 'Clients/Contractors' },
        { label: 'Locations', icon: MapPin, path: 'Clients/Locations' },
        { label: 'Company', icon: Building2, path: 'Clients/Company' }
      ]
    },
    { icon: Calendar, label: 'Calendar', path: 'Calendar', colorKey: 'calendar' },
    { 
      icon: FileText, 
      label: 'Quotes', 
      path: 'Quotes',
      colorKey: 'quotes',
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
      colorKey: 'contracts',
      subItems: [
        { label: 'All Contracts', icon: FileSignature, path: 'Contracts' },
        { label: 'Contracts Sent', icon: Send, path: 'Contracts/Sent' },
        { label: 'Contracts Signed', icon: FileCheck, path: 'Contracts/Signed' }
      ]
    },
    { 
      icon: ClipboardList, 
      label: 'Jobs', 
      path: 'Jobs',
      colorKey: 'jobs',
      subItems: [
        { label: 'All Jobs', icon: ClipboardList, path: 'Jobs' },
        { label: 'Ready To Start', icon: Play, path: 'Jobs/ReadyToStart' },
        { label: 'Jobs In Progress', icon: Clock3, path: 'Jobs/InProgress' },
        { label: 'Jobs Completed', icon: CheckCircle, path: 'Jobs/Completed' }
      ]
    },
    { icon: Briefcase, label: 'Work Orders', path: 'WorkOrders', colorKey: 'workOrders' },
    { 
      icon: Clock3, 
      label: 'Time Sheet', 
      path: 'Time Sheet',
      colorKey: 'timeSheet',
      subItems: effectiveRole === 'admin' || effectiveRole === 'manager' ? [
        { label: 'Time Logs', icon: Clock3, path: 'Time Sheet' },
        { label: 'Wage Rate', icon: DollarSign, path: 'Time Sheet/WageRate' },
        { label: 'General Tasks', icon: ClipboardList, path: 'Time Sheet/GeneralTasks' },
        { label: 'Weekly Report', icon: BarChart3, path: 'Time Sheet/WeeklyReport' },
        { label: 'Payroll', icon: DollarSign, path: 'Time Sheet/Payroll' }
      ] : undefined
    },
    { icon: Camera, label: 'Photos', path: 'Photos', colorKey: 'photos' },
    { icon: Package, label: 'Items', path: 'Items', colorKey: 'items' },
    { 
      icon: Building2, 
      label: 'Vendors', 
      path: 'Vendors',
      colorKey: 'vendors',
      subItems: [
        { label: 'Vendor Company', icon: Building2, path: 'Vendors' },
        { label: 'Vendor Contacts', icon: Contact, path: 'Vendors/Contacts' },
        { label: 'Vendor Price List', icon: ListOrdered, path: 'Vendors/PriceList' }
      ]
    },
    { icon: Star, label: 'Reviews', path: 'Reviews', colorKey: 'reviews' },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: 'Settings',
      colorKey: 'settings',
      subItems: [
        { label: 'Admin Dashboard', icon: LayoutDashboard, path: 'Mode/Admin' },
        { label: 'Employee Portal', icon: HardHat, path: 'Mode/Employee' },
        { label: 'Customer Portal', icon: UserCog, path: 'Mode/Customer' },
        ...(effectiveRole === 'admin' ? [
          { label: 'Employees', icon: Users, path: 'Settings/Employees' },
          { label: 'Departments', icon: Building, path: 'Settings/Departments' },
          { label: 'Roles & Permissions', icon: Shield, path: 'Settings/Roles' },
          { label: 'Taxes', icon: Receipt, path: 'Settings/Taxes' }
        ] : [])
      ]
    }
  ];

  // Filter menu for employees - they only see limited options
  const filteredMenu = effectiveRole === 'employee' 
    ? menuConfig.filter(item => ['Dashboard', 'Messages', 'Calendar', 'Jobs', 'Time Sheet', 'Photos'].includes(item.label))
    : menuConfig;

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
      // Also navigate to the main page when clicking on items with submenus
      setActiveItem(path);
      if (onNavigate) {
        onNavigate(path);
      }
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
      width: '200px',
      minWidth: '200px',
      backgroundColor: bgColor,
      borderRight: `1px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: '24px 16px 24px 16px',
      gap: '8px',
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      {/* Menu Items */}
      {filteredMenu.map((item, index) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenus.includes(item.label);
        const itemIsActive = isActive(item.path);

        return (
          <div key={index}>
            {/* Main Menu Item - 3D Plastic Button */}
            <PlasticButton
              colorKey={item.colorKey}
              icon={item.icon}
              label={item.label}
              isActive={itemIsActive && !hasSubItems}
              onClick={() => handleClick(item.path, item.label, !!hasSubItems)}
              hasDropdown={hasSubItems}
              isExpanded={isExpanded}
            />

            {/* Sub Menu Items */}
            {hasSubItems && isExpanded && (
              <div style={{
                marginTop: '4px',
                marginLeft: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {item.subItems!.map((subItem, subIndex) => {
                  const subIsActive = activeItem === subItem.path;
                  
                  return (
                    <PlasticButton
                      key={subIndex}
                      colorKey="subItem"
                      icon={subItem.icon}
                      label={subItem.label}
                      isActive={subIsActive}
                      onClick={() => handleSubItemClick(subItem.path)}
                      size="small"
                    />
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
