import { useState } from 'react';
import { 
  Home, Calendar, UserCircle, FileText, FileSignature, 
  ClipboardList, Briefcase, Clock3, MessageSquare, Camera,
  Package, Building2, Star, Settings, Moon, Sun,
  ChevronLeft, ChevronRight, MapPin, Phone, TrendingUp,
  DollarSign, Users, CheckCircle
} from 'lucide-react';

export function BoardroomDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = [
    'https://images.unsplash.com/photo-1693948568453-a3564f179a84?w=800',
    'https://images.unsplash.com/photo-1601063936640-a0e4e4ed081c?w=800',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800',
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800'
  ];

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';

  const menuItems = [
    { icon: Home, label: 'Dashboard', color: '#D4A024' },
    { icon: Calendar, label: 'Calendar', color: '#42A5F5' },
    { icon: UserCircle, label: 'Clients', color: '#66BB6A' },
    { icon: FileText, label: 'Quotes', color: '#FFA726' },
    { icon: FileSignature, label: 'Contracts', color: '#AB47BC' },
    { icon: ClipboardList, label: 'Jobs', color: '#EF5350' },
    { icon: Briefcase, label: 'Work Orders', color: '#26C6DA' },
    { icon: Clock3, label: 'Time Sheet', color: '#7E57C2' },
    { icon: MessageSquare, label: 'Messages', color: '#EC407A' },
    { icon: Camera, label: 'Photos', color: '#3B9CAA' },
    { icon: Package, label: 'Items', color: '#FFCA28' },
    { icon: Building2, label: 'Vendors', color: '#8D6E63' },
    { icon: Star, label: 'Reviews', color: '#FFA000' },
    { icon: Settings, label: 'Settings', color: '#78909C' }
  ];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: bgColor }}>
      {/* Sidebar */}
      <aside className="w-24 flex flex-col items-center py-6 gap-3" style={{ backgroundColor: cardBg, borderRight: `1px solid ${borderColor}` }}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-14 h-14 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: item.color }}
            title={item.label}
          >
            <item.icon className="w-6 h-6 text-white" />
          </button>
        ))}
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-14 h-14 rounded-xl flex items-center justify-center mt-4 transition-all"
          style={{ backgroundColor: darkMode ? '#3D3D3D' : '#E5E5E5' }}
        >
          {darkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-gray-700" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl" style={{ color: textColor }}>Boardroom 360 Dashboard</h1>
              <p className="text-sm mt-1" style={{ color: textMuted }}>Admin Portal</p>
            </div>
            <div className="flex gap-3">
              <button className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <Search className="w-5 h-5" style={{ color: textColor }} />
              </button>
              <button className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <Bell className="w-5 h-5" style={{ color: textColor }} />
              </button>
            </div>
          </div>

          {/* Photo Carousel */}
          <div className="mb-8 relative rounded-2xl overflow-hidden" style={{ height: '320px', backgroundColor: cardBg }}>
            <img 
              src={photos[currentPhotoIndex]} 
              alt="Job Photo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Navigation Buttons */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: '#D4A024' }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: '#D4A024' }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: index === currentPhotoIndex ? '#D4A024' : 'rgba(255,255,255,0.4)' }}
                />
              ))}
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-6 left-6">
              <h3 className="text-xl text-white">Recent Job Photos</h3>
              <p className="text-sm text-white/80">Photo {currentPhotoIndex + 1} of {photos.length}</p>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Today's Schedule (2/3 width) */}
            <div className="col-span-2 rounded-2xl p-6" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <h2 className="text-xl mb-4" style={{ color: textColor }}>Today's Schedule</h2>
              
              {/* Map */}
              <div className="rounded-xl overflow-hidden mb-4" style={{ height: '192px', backgroundColor: borderColor }}>
                <div className="w-full h-full flex items-center justify-center" style={{ color: textMuted }}>
                  <MapPin className="w-8 h-8" />
                  <span className="ml-2">Map View</span>
                </div>
              </div>

              {/* Appointments */}
              <div className="space-y-3">
                {[
                  { time: '9:00 AM', client: 'Anderson Residence', address: '742 Evergreen Terrace', color: '#42A5F5' },
                  { time: '1:30 PM', client: 'Thompson Commercial', address: '1500 Oak Boulevard', color: '#66BB6A' },
                  { time: '3:45 PM', client: 'Martinez Family', address: '88 Maple Drive', color: '#FFA726' }
                ].map((apt, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl" style={{ backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5' }}>
                    <div className="w-1 rounded-full" style={{ backgroundColor: apt.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 style={{ color: textColor }}>{apt.client}</h4>
                          <p className="text-sm" style={{ color: textMuted }}>{apt.address}</p>
                        </div>
                        <span className="text-sm" style={{ color: apt.color }}>{apt.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Pipeline */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <h2 className="text-xl mb-4" style={{ color: textColor }}>Sales Pipeline</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: textMuted }}>Leads</span>
                    <span style={{ color: textColor }}>24</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: borderColor }}>
                    <div className="h-full rounded-full" style={{ width: '70%', backgroundColor: '#42A5F5' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: textMuted }}>Quotes</span>
                    <span style={{ color: textColor }}>18</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: borderColor }}>
                    <div className="h-full rounded-full" style={{ width: '55%', backgroundColor: '#66BB6A' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: textMuted }}>Active Jobs</span>
                    <span style={{ color: textColor }}>12</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: borderColor }}>
                    <div className="h-full rounded-full" style={{ width: '40%', backgroundColor: '#FFA726' }} />
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5' }}>
                  <div className="text-2xl" style={{ color: '#66BB6A' }}>67%</div>
                  <p className="text-sm" style={{ color: textMuted }}>Conversion Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="rounded-2xl p-6" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <DollarSign className="w-8 h-8 mb-3" style={{ color: '#66BB6A' }} />
              <div className="text-3xl" style={{ color: textColor }}>$284k</div>
              <p className="text-sm" style={{ color: textMuted }}>Monthly Revenue</p>
            </div>
            <div className="rounded-2xl p-6" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <TrendingUp className="w-8 h-8 mb-3" style={{ color: '#FFA726' }} />
              <div className="text-3xl" style={{ color: textColor }}>$42k</div>
              <p className="text-sm" style={{ color: textMuted }}>Pending Invoices</p>
            </div>
            <div className="rounded-2xl p-6" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <Users className="w-8 h-8 mb-3" style={{ color: '#42A5F5' }} />
              <div className="text-3xl" style={{ color: textColor }}>32</div>
              <p className="text-sm" style={{ color: textMuted }}>Active Team Members</p>
            </div>
          </div>

          {/* Success Message */}
          <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: '#4F6A41', color: 'white' }}>
            ✅ Dashboard loaded successfully! All systems operational.
          </div>
        </div>
      </main>
    </div>
  );
}