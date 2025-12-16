import { useState, useRef, useEffect } from 'react';
import { 
  Moon, Sun,
  ChevronLeft, ChevronRight, MapPin, DollarSign,
  TrendingUp, Users, Bell, Search, Star, Menu, X
} from 'lucide-react';
import { Button } from './Button';
import { SidebarEnhanced } from './SidebarEnhanced';

export function FullDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);
  const [mapViewMode, setMapViewMode] = useState<'visits' | 'jobs' | 'both'>('both');
  const [showMapModal, setShowMapModal] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const pinHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper functions to lighten/darken colors for hover and active states
  const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(((255 - ((num >> 16) & 0xff)) * percent) / 100));
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(((255 - ((num >> 8) & 0xff)) * percent) / 100));
    const b = Math.min(255, (num & 0xff) + Math.round(((255 - (num & 0xff)) * percent) / 100));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  const darkenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) - Math.round((((num >> 16) & 0xff) * percent) / 100));
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round((((num >> 8) & 0xff) * percent) / 100));
    const b = Math.max(0, (num & 0xff) - Math.round(((num & 0xff) * percent) / 100));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };



  const photos = [
    { url: 'https://images.unsplash.com/photo-1693948568453-a3564f179a84?w=1200', title: 'Anderson Residence - Installation' },
    { url: 'https://images.unsplash.com/photo-1601063936640-a0e4e4ed081c?w=1200', title: 'Oak Flooring - Living Room' },
    { url: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=1200', title: 'Martinez Home - Completed Floor' },
    { url: 'https://images.unsplash.com/photo-1711915442858-2a5bb7ba67d8?w=1200', title: 'Thompson Commercial - Oak Installation' },
    { url: 'https://images.unsplash.com/photo-1690310588789-8fcee016f619?w=1200', title: 'Modern Wood Flooring - Office' },
    { url: 'https://images.unsplash.com/photo-1680637301521-13652448f0e5?w=1200', title: 'Dark Hardwood - Luxury Suite' },
    { url: 'https://images.unsplash.com/photo-1622193736115-9032b599ef61?w=1200', title: 'Light Oak Flooring - Kitchen' },
    { url: 'https://images.unsplash.com/photo-1693948568453-a3564f179a84?w=1200', title: 'Williams Estate - Project' },
    { url: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=1200', title: 'Johnson Plaza - Completion' }
  ];

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';

  const appointments = [
    { time: '9:00 AM', client: 'Anderson Residence', address: '742 Evergreen Terrace', color: '#42A5F5', status: 'In Progress', location: '742 Evergreen Terrace, Springfield', type: 'job' as const },
    { time: '11:00 AM', client: 'Wilson Home - Estimate', address: '234 Pine Street', color: '#9C27B0', status: 'Scheduled', location: '234 Pine Street, Downtown', type: 'visit' as const },
    { time: '1:30 PM', client: 'Thompson Commercial', address: '1500 Oak Boulevard', color: '#66BB6A', status: 'Scheduled', location: '1500 Oak Boulevard, Suite 200', type: 'job' as const },
    { time: '2:45 PM', client: 'Garcia Consultation', address: '456 Elm Avenue', color: '#FF9800', status: 'Scheduled', location: '456 Elm Avenue, Midtown', type: 'visit' as const },
    { time: '4:00 PM', client: 'Martinez Family', address: '88 Maple Drive', color: '#FFA726', status: 'Scheduled', location: '88 Maple Drive, Riverside', type: 'job' as const }
  ];

  // Filter appointments based on map view mode
  const filteredAppointments = appointments.filter(apt => {
    if (mapViewMode === 'both') return true;
    return apt.type === mapViewMode.replace('s', ''); // 'visits' -> 'visit', 'jobs' -> 'job'
  });

  const getRouteStats = () => {
    const count = filteredAppointments.length;
    // Calculate estimated distance based on number of stops
    const distance = count > 1 ? (count * 6.2).toFixed(1) : '0';
    return { count, distance };
  };

  const routeStats = getRouteStats();

  // Monthly conversion rate data for the year
  const monthlyConversionData = [
    { month: 'Jan', rate: 62 },
    { month: 'Feb', rate: 58 },
    { month: 'Mar', rate: 64 },
    { month: 'Apr', rate: 71 },
    { month: 'May', rate: 69 },
    { month: 'Jun', rate: 73 },
    { month: 'Jul', rate: 68 },
    { month: 'Aug', rate: 65 },
    { month: 'Sep', rate: 70 },
    { month: 'Oct', rate: 72 },
    { month: 'Nov', rate: 67 },
    { month: 'Dec', rate: 0 } // Current month
  ];

  // Monthly jobs data
  const monthlyJobs = [
    { name: 'Anderson Residence', amount: 28500 },
    { name: 'Thompson Commercial', amount: 45200 },
    { name: 'Martinez Family', amount: 18900 },
    { name: 'Johnson Office Plaza', amount: 67000 },
    { name: 'Williams Estate', amount: 31400 },
    { name: 'Brown Retail Store', amount: 22800 },
    { name: 'Davis Townhomes', amount: 38600 },
    { name: 'Miller Residence', amount: 15200 },
    { name: 'Garcia Restaurant', amount: 16400 }
  ];

  // Create Google Maps URL with multiple markers
  const createMapUrl = () => {
    const baseUrl = 'https://www.google.com/maps/embed/v1/directions';
    // For demo purposes, using a static map with markers
    // In production, you would use actual addresses and Google Maps API key
    const mapUrl = 'https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d193595.15830869428!2d-74.11976373946234!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e0!4m5!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!3m2!1d40.7127753!2d-74.0059728!4m5!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square%2C%20Manhattan%2C%20NY!3m2!1d40.758896!2d-73.98513199999999!4m5!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C%20New%20York%2C%20NY!3m2!1d40.7830603!2d-73.9712488!4m5!1s0x89c25a316bf4d635%3A0x88e7d5c8f3d3c28!2sCentral%20Park%2C%20New%20York%2C%20NY!3m2!1d40.782865!2d-73.9653551!4m5!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C%20New%20York%2C%20NY!3m2!1d40.7830603!2d-73.9712488!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus';
    return mapUrl;
  };

  const nextPhoto = () => {
    const maxIndex = isMobile ? photos.length - 1 : photos.length - 3;
    setCurrentPhotoIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: bgColor, position: 'relative' }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 999,
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowMobileSidebar(false)}
          />
          {/* Sidebar Drawer */}
          <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            zIndex: 1000,
            transform: showMobileSidebar ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease'
          }}>
            <SidebarEnhanced 
              activePage="Dashboard" 
              darkMode={darkMode} 
              onNavigate={(page) => {
                setShowMobileSidebar(false);
                onNavigate?.(page);
              }} 
              onToggleDarkMode={() => setDarkMode(!darkMode)} 
            />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <SidebarEnhanced activePage="Dashboard" darkMode={darkMode} onNavigate={onNavigate} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      )}

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginLeft: isMobile ? '0' : '180px',
        width: isMobile ? '100%' : 'auto'
      }}>
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: bgColor,
            borderBottom: `1px solid ${borderColor}`,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#D4A024',
                border: 'none',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Menu style={{ width: '24px', height: '24px', color: 'white' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', color: textColor, margin: '0' }}>
                Boardroom 360
              </h1>
              <p style={{ fontSize: '12px', color: textMuted, margin: 0 }}>
                Admin Portal
              </p>
            </div>
          </div>
        )}

        <div style={{ padding: isMobile ? '16px' : '32px' }}>
          {/* Keyframe animation for bell */}
          <style>{`
            @keyframes bellPulsate {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 4px 16px rgba(220, 53, 69, 0.6), 0 0 20px 8px rgba(220, 53, 69, 0.3);
              }
            }
          `}</style>

          {/* Header - Desktop Only */}
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '32px', color: textColor, margin: '0 0 8px 0' }}>
                  Boardroom 360 Dashboard
                </h1>
                <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>
                  Admin Portal • Saturday, November 15, 2025
                </p>
              </div>
              
              {/* Right side - Search, Dark Mode, Bell */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Search Button */}
                <button
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  title="Search"
                >
                  <Search style={{ width: '20px', height: '20px', color: textMuted }} />
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? (
                    <Moon style={{ width: '20px', height: '20px', color: textMuted }} />
                  ) : (
                    <Sun style={{ width: '20px', height: '20px', color: textMuted }} />
                  )}
                </button>

                {/* Notification Bell */}
                <button
                  style={{
                    width: '52px',
                    height: '52px',
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
                  }}
                  title="40 Notifications"
                >
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
                    40
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Photo Carousel */}
          <div 
            style={{
              position: 'relative',
              marginBottom: isMobile ? '16px' : '32px',
              cursor: 'pointer'
            }}
            onClick={() => onNavigate?.('Photos')}
            title="Click to view all photos"
          >
            {/* Left Arrow */}
            {!isMobile && (
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                disabled={currentPhotoIndex === 0}
                style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#D4A024',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPhotoIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                  opacity: currentPhotoIndex === 0 ? 0.5 : 1,
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  if (currentPhotoIndex !== 0) {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
              >
                <ChevronLeft style={{ width: '24px', height: '24px', color: 'white' }} />
              </button>
            )}

            {/* Right Arrow */}
            {!isMobile && (
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                disabled={currentPhotoIndex >= photos.length - 3}
                style={{
                  position: 'absolute',
                  right: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#D4A024',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPhotoIndex >= photos.length - 3 ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                  opacity: currentPhotoIndex >= photos.length - 3 ? 0.5 : 1,
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  if (currentPhotoIndex < photos.length - 3) {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
              >
                <ChevronRight style={{ width: '24px', height: '24px', color: 'white' }} />
              </button>
            )}

            {/* Images Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
              gap: isMobile ? '12px' : '16px',
              height: isMobile ? '220px' : '200px',
              position: 'relative'
            }}>
              {photos.slice(currentPhotoIndex, currentPhotoIndex + (isMobile ? 1 : 3)).map((photo, index) => (
                <div
                  key={currentPhotoIndex + index}
                  style={{
                    position: 'relative',
                    height: '200px',
                    backgroundColor: '#000',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
                  }} />

                  {/* Mobile Navigation Arrows - Inside Photo */}
                  {isMobile && (
                    <>
                      {currentPhotoIndex > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                          style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '44px',
                            height: '44px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            border: '2px solid #D4A024',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <ChevronLeft style={{ width: '24px', height: '24px', color: '#D4A024' }} />
                        </button>
                      )}
                      {currentPhotoIndex < photos.length - 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '44px',
                            height: '44px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            border: '2px solid #D4A024',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <ChevronRight style={{ width: '24px', height: '24px', color: '#D4A024' }} />
                        </button>
                      )}
                    </>
                  )}

                  {/* Photo Title Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '16px',
                    right: '16px',
                    color: 'white'
                  }}>
                    <h3 style={{ fontSize: isMobile ? '14px' : '13px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {photo.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: isMobile ? '12px' : '16px'
            }}>
              {Array.from({ length: isMobile ? photos.length : photos.length - 2 }).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(index); }}
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: index === currentPhotoIndex ? '#D4A024' : 'rgba(128,128,128,0.4)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* 3-Column Layout */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
            gap: isMobile ? '16px' : '24px', 
            marginBottom: isMobile ? '16px' : '24px' 
          }}>
            {/* Today's Schedule - Left Side (2/3 width) */}
            <div 
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '16px',
                padding: isMobile ? '16px' : '24px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onClick={() => onNavigate?.('Calendar')}
              onMouseEnter={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(0)')}
              title="Click to view full calendar"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <MapPin style={{ width: isMobile ? '18px' : '20px', height: isMobile ? '18px' : '20px', color: '#3B9CAA' }} />
                <h2 style={{ 
                  fontSize: isMobile ? '18px' : '20px', 
                  color: textColor, 
                  margin: 0
                }}>
                  Today's Schedule{isMobile ? '' : `, (${appointments.length} stops)`}
                </h2>
              </div>

              {/* Google Map with Route */}
              <div 
                style={{
                  height: '280px',
                  backgroundColor: darkMode ? '#1A2F1A' : '#E8F5E9',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  overflow: 'hidden',
                  border: `1px solid ${borderColor}`,
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={(e) => { e.stopPropagation(); setShowMapModal(true); }}
              >
                {/* Google Maps Background */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d193595.15830869428!2d-74.11976373946234!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e0!4m5!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!3m2!1d40.7127753!2d-74.0059728!4m5!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square%2C%20Manhattan%2C%20NY!3m2!1d40.758896!2d-73.98513199999999!4m5!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C%20New%20York%2C%20NY!3m2!1d40.7830603!2d-73.9712488!4m5!1s0x89c25a316bf4d635%3A0x88e7d5c8f3d3c28!2sCentral%20Park%2C%20New%20York%2C%20NY!3m2!1d40.782865!2d-73.9653551!4m5!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C%20New%20York%2C%20NY!3m2!1d40.7830603!2d-73.9712488!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none'
                  }}
                  loading="lazy"
                />
                {/* Map Grid Background */}
                
                {/* Route Line */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#3B9CAA" />
                    </marker>
                  </defs>
                  {/* Route path connecting all stops */}
                  <path
                    d="M 100 80 Q 200 90, 280 120 T 450 160"
                    stroke="#3B9CAA"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    markerEnd="url(#arrowhead)"
                    opacity="0.8"
                  />
                </svg>

                {/* Location Markers */}
                {/* Stop 1 - Anderson Residence */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '15%',
                    top: '25%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    if (pinHoverTimeoutRef.current) {
                      clearTimeout(pinHoverTimeoutRef.current);
                    }
                    pinHoverTimeoutRef.current = setTimeout(() => {
                      setHoveredPin(0);
                    }, 750);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    if (pinHoverTimeoutRef.current) {
                      clearTimeout(pinHoverTimeoutRef.current);
                    }
                    setHoveredPin(null);
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: appointments[0].color,
                    borderRadius: '50% 50% 50% 0',
                    transform: hoveredPin === 0 ? 'rotate(-45deg) scale(1.2)' : 'rotate(-45deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: '2px solid white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    zIndex: hoveredPin === 0 ? 10 : 1
                  }}>
                    <span style={{ 
                      transform: 'rotate(45deg)', 
                      color: 'white', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>1</span>
                  </div>
                  {hoveredPin === 0 && (
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      zIndex: 10
                    }}>
                      <div>{appointments[0].client}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                        {appointments[0].address}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                        {appointments[0].time}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stop 2 - Thompson Commercial */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '42%',
                    top: '45%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    if (pinHoverTimeoutRef.current) {
                      clearTimeout(pinHoverTimeoutRef.current);
                    }
                    pinHoverTimeoutRef.current = setTimeout(() => {
                      setHoveredPin(1);
                    }, 750);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    if (pinHoverTimeoutRef.current) {
                      clearTimeout(pinHoverTimeoutRef.current);
                    }
                    setHoveredPin(null);
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: appointments[1].color,
                    borderRadius: '50% 50% 50% 0',
                    transform: hoveredPin === 1 ? 'rotate(-45deg) scale(1.2)' : 'rotate(-45deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: '2px solid white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    zIndex: hoveredPin === 1 ? 10 : 1
                  }}>
                    <span style={{ 
                      transform: 'rotate(45deg)', 
                      color: 'white', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>2</span>
                  </div>
                  {hoveredPin === 1 && (
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      zIndex: 10
                    }}>
                      <div>{appointments[1].client}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                        {appointments[1].address}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                        {appointments[1].time}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stop 3 - Martinez Family */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '68%',
                    top: '58%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    if (pinHoverTimeoutRef.current) {
                      clearTimeout(pinHoverTimeoutRef.current);
                    }
                    pinHoverTimeoutRef.current = setTimeout(() => {
                      setHoveredPin(2);
                    }, 750);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    if (pinHoverTimeoutRef.current) {
                      clearTimeout(pinHoverTimeoutRef.current);
                    }
                    setHoveredPin(null);
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: appointments[2].color,
                    borderRadius: '50% 50% 50% 0',
                    transform: hoveredPin === 2 ? 'rotate(-45deg) scale(1.2)' : 'rotate(-45deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: '2px solid white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    zIndex: hoveredPin === 2 ? 10 : 1
                  }}>
                    <span style={{ 
                      transform: 'rotate(45deg)', 
                      color: 'white', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>3</span>
                  </div>
                  {hoveredPin === 2 && (
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      zIndex: 10
                    }}>
                      <div>{appointments[2].client}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                        {appointments[2].address}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                        {appointments[2].time}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointments */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.map((apt, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                      borderRadius: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{
                      width: '4px',
                      height: '48px',
                      backgroundColor: apt.color,
                      borderRadius: '2px'
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h4 style={{ fontSize: '16px', color: textColor, margin: '0 0 4px 0' }}>
                            {apt.client}
                          </h4>
                          <p style={{ fontSize: '14px', color: textMuted, margin: '0 0 4px 0' }}>
                            {apt.address}
                          </p>
                          <span style={{
                            fontSize: '12px',
                            color: apt.color,
                            backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {apt.status}
                          </span>
                        </div>
                        <span style={{ fontSize: '14px', color: apt.color, fontWeight: '600' }}>
                          {apt.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Pipeline - Right Side (1/3 width) */}
            <div 
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '16px',
                padding: isMobile ? '16px' : '24px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onClick={() => onNavigate?.('Client')}
              onMouseEnter={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(0)')}
              title="Click to view all clients"
            >
              <h2 style={{ fontSize: isMobile ? '18px' : '20px', color: textColor, margin: '0 0 24px 0' }}>
                Sales Pipeline
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* New Leads */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: textMuted }}>New Leads</span>
                    <span style={{ fontSize: '16px', color: textColor, fontWeight: '600' }}>8</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: borderColor, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '25%', backgroundColor: '#42A5F5' }} />
                  </div>
                </div>

                {/* Quotes Sent */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: textMuted }}>Quotes Sent</span>
                    <span style={{ fontSize: '16px', color: textColor, fontWeight: '600' }}>15</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: borderColor, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '50%', backgroundColor: '#66BB6A' }} />
                  </div>
                </div>

                {/* Quotes Viewed */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: textMuted }}>Quotes Viewed</span>
                    <span style={{ fontSize: '16px', color: textColor, fontWeight: '600' }}>9</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: borderColor, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '30%', backgroundColor: '#9C27B0' }} />
                  </div>
                </div>

                {/* Pending Approval */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: textMuted }}>Pending Approval</span>
                    <span style={{ fontSize: '16px', color: textColor, fontWeight: '600' }}>6</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: borderColor, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '20%', backgroundColor: '#FFA726' }} />
                  </div>
                </div>

                {/* Follow-ups Needed */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: textMuted }}>Follow-ups Needed</span>
                    <span style={{ fontSize: '16px', color: textColor, fontWeight: '600' }}>11</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: borderColor, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '37%', backgroundColor: '#EF5350' }} />
                  </div>
                </div>

                {/* Conversion Rate Card */}
                <div 
                  style={{
                    backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '8px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setShowConversionModal(true)}
                  onMouseLeave={() => setShowConversionModal(false)}
                >
                  <p style={{ 
                    fontSize: '12px', 
                    color: textMuted, 
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    Conversion Rate
                  </p>
                  
                  <div style={{ fontSize: '36px', color: '#66BB6A', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
                    67%
                  </div>
                  <div style={{ fontSize: '12px', color: textMuted, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Previous Month:</span>
                    <span style={{ fontWeight: '600', color: textColor }}>72%</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#66BB6A', textAlign: 'center', marginTop: '8px', opacity: 0.8 }}>
                    Hover for details
                  </div>
                </div>

                {/* Monthly Revenue Card */}
                <div 
                  style={{
                    backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '8px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setShowRevenueDetails(true)}
                  onMouseLeave={() => setShowRevenueDetails(false)}
                >
                  <p style={{ 
                    fontSize: '12px', 
                    color: textMuted, 
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    Monthly Revenue
                  </p>
                  
                  {!showRevenueDetails ? (
                    <>
                      <DollarSign style={{ width: '28px', height: '28px', color: '#66BB6A', marginBottom: '12px' }} />
                      <div style={{ fontSize: '28px', color: textColor, fontWeight: 'bold', marginBottom: '8px' }}>
                        $284k
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '12px', color: textMuted, display: 'flex', justifyContent: 'space-between' }}>
                          <span>Previous Month:</span>
                          <span style={{ fontWeight: '600', color: '#66BB6A' }}>$267k</span>
                        </div>
                        <div style={{ fontSize: '12px', color: textMuted, display: 'flex', justifyContent: 'space-between' }}>
                          <span>Previous Year:</span>
                          <span style={{ fontWeight: '600', color: textColor }}>$241k</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ marginTop: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                      <p style={{ fontSize: '10px', color: textMuted, marginBottom: '12px', textAlign: 'center' }}>
                        November 2025 Jobs
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {monthlyJobs.map((job, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px',
                            backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
                            borderRadius: '6px',
                            borderLeft: `3px solid #66BB6A`
                          }}>
                            <span style={{ fontSize: '11px', color: textColor, fontWeight: '500' }}>
                              {job.name}
                            </span>
                            <span style={{ fontSize: '11px', color: '#66BB6A', fontWeight: '600' }}>
                              ${(job.amount / 1000).toFixed(1)}k
                            </span>
                          </div>
                        ))}
                      </div>
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: `1px solid ${borderColor}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        <span style={{ color: textMuted }}>Total:</span>
                        <span style={{ color: '#66BB6A' }}>$284k</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Revenue Pending Card */}
                <div style={{
                  backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
                  borderRadius: '12px',
                  padding: '20px',
                  position: 'relative'
                }}>
                  <p style={{ 
                    fontSize: '12px', 
                    color: textMuted, 
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    Revenue Pending
                  </p>
                  <div style={{ fontSize: '28px', color: textColor, fontWeight: 'bold', marginBottom: '8px' }}>
                    $127.8k
                  </div>
                  <div style={{ fontSize: '12px', color: textMuted }}>
                    8 signed contracts
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Revenue Metrics - 3 Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isMobile ? '16px' : '24px' }}>


            {/* Bonus Pool Forecast */}
            <div style={{
              backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
              border: `1px solid ${borderColor}`,
              borderRadius: '16px',
              padding: isMobile ? '16px' : '24px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Star style={{ width: '24px', height: '24px', color: '#FFA726' }} />
                <p style={{ fontSize: '13px', color: textMuted, margin: 0, fontWeight: '600' }}>
                  Bonus Pool Forecast
                </p>
              </div>
              <div style={{ fontSize: '36px', color: textColor, fontWeight: 'bold', marginBottom: '8px' }}>
                $18,450
              </div>
              <div style={{ fontSize: '13px', color: textMuted }}>
                P4P this month
              </div>
            </div>
          </div>


        </div>
      </main>

      {/* Conversion Rate Modal */}
      {showConversionModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={() => setShowConversionModal(true)}
          onMouseLeave={() => setShowConversionModal(false)}
        >
          <div style={{
            backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            border: `1px solid ${borderColor}`
          }}>
            <h2 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0', textAlign: 'center' }}>
              2025 Monthly Conversion Rates
            </h2>
            <p style={{ fontSize: '14px', color: textMuted, textAlign: 'center', marginBottom: '32px' }}>
              Quote-to-Contract Conversion Performance
            </p>

            {/* Graph */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-between', 
              gap: '12px', 
              height: '300px',
              marginBottom: '32px',
              padding: '0 20px'
            }}>
              {monthlyConversionData.slice(0, -1).map((data, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '100%',
                    height: `${(data.rate / 100) * 300}px`,
                    backgroundColor: index === 10 ? '#66BB6A' : darkMode ? '#555' : '#CCC',
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = index === 10 ? '#7ED488' : darkMode ? '#666' : '#BBB';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index === 10 ? '#66BB6A' : darkMode ? '#555' : '#CCC';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-32px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: index === 10 ? '#66BB6A' : textColor,
                      whiteSpace: 'nowrap'
                    }}>
                      {data.rate}%
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '13px', 
                    color: index === 10 ? '#66BB6A' : textMuted,
                    fontWeight: index === 10 ? '700' : '500'
                  }}>{data.month}</span>
                </div>
              ))}
            </div>

            {/* Monthly Conversion Examples */}
            <div style={{
              backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '18px', color: textColor, margin: '0 0 20px 0' }}>
                November 2025 Conversion Breakdown
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {/* Converted */}
                <div style={{
                  backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
                  borderRadius: '12px',
                  padding: '20px',
                  borderLeft: '4px solid #66BB6A'
                }}>
                  <div style={{ fontSize: '14px', color: textMuted, marginBottom: '8px' }}>
                    Converted to Contract
                  </div>
                  <div style={{ fontSize: '32px', color: '#66BB6A', fontWeight: 'bold' }}>
                    10
                  </div>
                  <div style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>
                    out of 15 quotes sent
                  </div>
                </div>

                {/* Not Converted */}
                <div style={{
                  backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
                  borderRadius: '12px',
                  padding: '20px',
                  borderLeft: '4px solid #EF5350'
                }}>
                  <div style={{ fontSize: '14px', color: textMuted, marginBottom: '8px' }}>
                    Not Converted
                  </div>
                  <div style={{ fontSize: '32px', color: '#EF5350', fontWeight: 'bold' }}>
                    5
                  </div>
                  <div style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>
                    declined or pending
                  </div>
                </div>
              </div>

              {/* Example Conversions */}
              <h4 style={{ fontSize: '14px', color: textMuted, margin: '0 0 12px 0', fontWeight: '600' }}>
                Recent Conversions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Anderson Residence', quote: '$28.5k', status: 'Converted', time: '2 days' },
                  { name: 'Thompson Commercial', quote: '$45.2k', status: 'Converted', time: '5 days' },
                  { name: 'Martinez Family', quote: '$18.9k', status: 'Converted', time: '3 days' },
                  { name: 'Johnson Office Plaza', quote: '$67k', status: 'Converted', time: '7 days' },
                  { name: 'Williams Estate', quote: '$31.4k', status: 'Pending', time: '1 day' }
                ].map((conv, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
                    borderRadius: '8px',
                    border: `1px solid ${borderColor}`
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', color: textColor, fontWeight: '600' }}>
                        {conv.name}
                      </div>
                      <div style={{ fontSize: '12px', color: textMuted, marginTop: '2px' }}>
                        Quote: {conv.quote} • {conv.time} to convert
                      </div>
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: conv.status === 'Converted' ? '#66BB6A' : '#FFA726',
                      backgroundColor: conv.status === 'Converted' 
                        ? darkMode ? 'rgba(102, 187, 106, 0.15)' : 'rgba(102, 187, 106, 0.1)'
                        : darkMode ? 'rgba(255, 167, 38, 0.15)' : 'rgba(255, 167, 38, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontWeight: '600'
                    }}>
                      {conv.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close hint */}
            <p style={{ 
              fontSize: '12px', 
              color: textMuted, 
              textAlign: 'center', 
              marginTop: '24px',
              opacity: 0.7 
            }}>
              Move your mouse away to close
            </p>
          </div>
        </div>
      )}

      {/* Enlarged Map Modal */}
      {showMapModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowMapModal(false)}
        >
          <div 
            className="route-modal-content"
            style={{
            backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
            borderRadius: '24px',
            padding: '30px',
            maxWidth: mapExpanded ? '1400px' : '900px',
            width: mapExpanded ? '90%' : '68%',
            maxHeight: mapExpanded ? '85vh' : '68vh',
            overflowY: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            border: `1px solid ${borderColor}`,
            transition: 'all 0.3s ease',
            position: 'relative',
            scrollbarWidth: 'thin',
            scrollbarColor: `${darkMode ? '#4D4D4D' : '#CCCCCC'} ${darkMode ? '#2D2D2D' : '#F5F5F5'}`,
            cursor: 'default'
          } as React.CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              .route-modal-content::-webkit-scrollbar {
                width: 8px;
              }
              .route-modal-content::-webkit-scrollbar-track {
                background: ${darkMode ? '#2D2D2D' : '#F5F5F5'};
                border-radius: 24px;
              }
              .route-modal-content::-webkit-scrollbar-thumb {
                background: ${darkMode ? '#4D4D4D' : '#CCCCCC'};
                border-radius: 24px;
              }
              .route-modal-content::-webkit-scrollbar-thumb:hover {
                background: ${darkMode ? '#5D5D5D' : '#AAAAAA'};
              }
            `}</style>
            
            {/* Expand/Shrink Controls */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              <button
                onClick={() => setMapExpanded(!mapExpanded)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#3B9CAA',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2D7A85';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B9CAA';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title={mapExpanded ? 'Shrink map' : 'Expand map'}
              >
                {mapExpanded ? '−' : '+'}
              </button>
              <button
                onClick={() => setShowMapModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#4D4D4D' : '#E5E5E5',
                  border: 'none',
                  color: darkMode ? '#FFFFFF' : '#333333',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF4444';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#4D4D4D' : '#E5E5E5';
                  e.currentTarget.style.color = darkMode ? '#FFFFFF' : '#333333';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Close"
              >
                ×
              </button>
            </div>

            <h2 style={{ fontSize: '22px', color: textColor, margin: '0 0 6px 0', textAlign: 'center' }}>
              Todays Appointments (5stops)
            </h2>
            <p style={{ fontSize: '13px', color: textMuted, textAlign: 'center', marginBottom: '24px' }}>
              {routeStats.count} {routeStats.count === 1 ? 'stop' : 'stops'} • ~{routeStats.distance} mi total
            </p>

            {/* View Mode Toggle */}
            <div style={{
              backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5',
              borderRadius: '24px',
              padding: '6px',
              display: 'flex',
              gap: '6px',
              marginBottom: '24px',
              justifyContent: 'center'
            }}>
              {(['visits', 'jobs', 'both'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setMapViewMode(mode)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: mapViewMode === mode ? '#3B9CAA' : 'transparent',
                    color: mapViewMode === mode ? 'white' : textColor,
                    border: 'none',
                    borderRadius: '18px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize'
                  }}
                  onMouseEnter={(e) => {
                    if (mapViewMode !== mode) {
                      e.currentTarget.style.backgroundColor = darkMode ? '#2D2D2D' : '#E5E5E5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (mapViewMode !== mode) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {mode === 'visits' ? 'Onsite Visits' : mode === 'jobs' ? 'Jobs' : 'Both'}
                </button>
              ))}
            </div>

            {/* Enlarged Map */}
            <div 
              style={{
                height: '450px',
                backgroundColor: darkMode ? '#1A2F1A' : '#E8F5E9',
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${borderColor}`,
                position: 'relative',
                backgroundImage: `
                repeating-linear-gradient(0deg, ${darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 0px, transparent 1px, transparent 20px, ${darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 21px),
                repeating-linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 0px, transparent 1px, transparent 20px, ${darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 21px)
              `
              }}
            >
              {/* Route Line */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <defs>
                  <marker id="arrowhead-large" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#3B9CAA" />
                  </marker>
                </defs>
                {/* Route path connecting all stops */}
                <path
                  d="M 150 120 Q 350 140, 500 200 T 750 280"
                  stroke="#3B9CAA"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="10,5"
                  markerEnd="url(#arrowhead-large)"
                  opacity="0.8"
                />
              </svg>

              {/* Location Markers - Dynamic based on filter */}
              {filteredAppointments.map((apt, idx) => {
                const positions = [
                  { left: '12%', top: '25%' },
                  { left: '28%', top: '35%' },
                  { left: '48%', top: '28%' },
                  { left: '62%', top: '42%' },
                  { left: '75%', top: '32%' }
                ];
                const pos = positions[idx] || positions[0];
                const isJob = apt.type === 'job';
                const isHovered = hoveredPin === idx;
                
                return (
                  <div 
                    key={idx}
                    data-pin="true"
                    onMouseEnter={() => setHoveredPin(idx)}
                    onMouseLeave={() => setHoveredPin(null)}
                    style={{
                      position: 'absolute',
                      left: pos.left,
                      top: pos.top,
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Pin marker - Different shapes for jobs vs visits */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: apt.color,
                      // Jobs: teardrop pin shape, Visits: circle
                      borderRadius: isJob ? '50% 50% 50% 0' : '50%',
                      transform: isJob 
                        ? (isHovered ? 'rotate(-45deg) scale(1.15)' : 'rotate(-45deg) scale(1)')
                        : (isHovered ? 'scale(1.15)' : 'scale(1)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isJob ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                      border: isJob ? '3px solid white' : '2px solid white',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      position: 'relative'
                    }}
                    >
                      <span style={{ 
                        transform: isJob ? 'rotate(45deg)' : 'none',
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>{idx + 1}</span>
                      {/* Type indicator badge */}
                      {!isJob && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-6px',
                          right: '-6px',
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#FF9800',
                          borderRadius: '50%',
                          border: '2px solid white',
                          fontSize: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: 'white'
                        }}>E</div>
                      )}
                    </div>
                    
                    {/* Hover Info - Absolutely positioned to not affect layout */}
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        top: '50px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        pointerEvents: 'none'
                      }}>
                        <div style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          color: 'white',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {apt.client}
                            <span style={{
                              fontSize: '10px',
                              backgroundColor: isJob ? '#4CAF50' : '#FF9800',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              {isJob ? 'JOB' : 'VISIT'}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                            {apt.time}
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                            {apt.address}
                          </div>
                        </div>
                        <div style={{
                          backgroundColor: apt.color,
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {apt.status}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Close hint */}
            <p style={{ 
              fontSize: '12px', 
              color: textMuted, 
              textAlign: 'center', 
              marginTop: '24px',
              opacity: 0.7 
            }}>
              Click outside to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}