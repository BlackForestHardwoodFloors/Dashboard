import { useState } from 'react';
import { 
  Home,
  MessageSquare,
  UserCircle,
  Calendar,
  FileText,
  FileSignature,
  ClipboardList,
  Briefcase,
  Clock3,
  Package,
  Building2,
  Settings,
  Bell,
  Search,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Plus,
  Star,
  Camera,
  Moon,
  Sun,
  MapPin,
  Phone,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function MainDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [photoScrollIndex, setPhotoScrollIndex] = useState(0);

  // Job photos array
  const jobPhotos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkd29vZCUyMGZsb29yJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2MzE4NTQ3MXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Anderson Residence - Installation',
      date: '2 hours ago'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1601063936640-a0e4e4ed081c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjBoYXJkd29vZCUyMGZsb29yaW5nfGVufDF8fHx8MTc2MzE3NDg0NXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Oak Flooring - Living Room',
      date: '3 hours ago'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1706058358041-19f10e95a89a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kJTIwZmxvb3IlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjMxODU0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Modern Interior - Complete',
      date: '5 hours ago'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1690310588533-6043216b0b5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoYXJkd29vZCUyMGZsb29yfGVufDF8fHx8MTc2MzE4NTQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Premium Hardwood Floor',
      date: '1 day ago'
    }
  ];

  const handleScrollLeft = () => {
    setPhotoScrollIndex(Math.max(0, photoScrollIndex - 1));
  };

  const handleScrollRight = () => {
    setPhotoScrollIndex(Math.min(jobPhotos.length - 1, photoScrollIndex + 1));
  };

  // Mock data
  const stats = {
    activeJobs: 24,
    activeJobsChange: '+12%',
    revenue: 284500,
    revenueChange: '+41.2%',
    revenuePending: 127800,
    bonusPool: 18450,
    completedToday: 8,
    completedChange: '+5%',
    teamMembers: 32,
    teamChange: '+2',
  };

  const todaysSchedule = [
    { id: 1, time: '9:00 AM', client: 'Anderson, Lisa', address: '14520 E Broadway Ave, Spokane Valley, WA 89037', phone: '(509) 555-1111' },
    { id: 2, time: '11:00 AM', client: 'Roberts, James', address: '16789 E Appleway Ave, Spokane Valley, WA 89037', phone: '(509) 555-2222' },
    { id: 3, time: '2:00 PM', client: 'Henderson, Patricia', address: '15420 E Valleyway Ave, Spokane Valley, WA 89037', phone: '(509) 555-3333' },
  ];

  const jobAlerts = [
    { id: 1, title: 'Parker Residence', subtitle: 'Over Labor Budget', status: '15% over target', severity: 'high' },
    { id: 2, title: 'Roberts Commercial', subtitle: 'Unsigned Change Order', status: '$2,400 pending', severity: 'medium' },
    { id: 3, title: 'Kim Family Home', subtitle: 'Missing Prep Checklist', status: 'Client action needed', severity: 'medium' },
  ];

  const salesPipeline = [
    { label: 'New Leads', value: 8, color: '#3B9CAA' },
    { label: 'Quotes Sent', value: 15, color: '#9C27B0' },
    { label: 'Quotes Viewed', value: 9, color: '#E91E63' },
    { label: 'Pending Approval', value: 6, color: '#FF9800' },
    { label: 'Follow-ups Needed', value: 11, color: '#00E676' },
  ];

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', color: '#D4A024', hover: '#C08E1F', active: '#A87A1A' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', color: '#1E88E5', hover: '#1976D2', active: '#1565C0' },
    { id: 'client', icon: UserCircle, label: 'Client', color: '#6ECAA0', hover: '#5DB890', active: '#4CA680' },
    { id: 'quotes', icon: FileText, label: 'Quotes', color: '#7A9B4B', hover: '#6A8A3D', active: '#5A7A2F' },
    { id: 'contracts', icon: FileSignature, label: 'Contracts', color: '#4A6B3C', hover: '#3D5A31', active: '#304926' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', color: '#8D6E63', hover: '#7D5E53', active: '#6D4E43' },
    { id: 'work-orders', icon: ClipboardList, label: 'Work Orders', color: '#66BB6A', hover: '#57AB5A', active: '#489B4A' },
    { id: 'timesheet', icon: Clock3, label: 'Time Sheet', color: '#E57373', hover: '#D56363', active: '#C55353' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', color: '#42A5F5', hover: '#3295E5', active: '#2285D5' },
    { id: 'photos', icon: Camera, label: 'Photos', color: '#00A8E8', hover: '#0098D8', active: '#0088C8' },
    { id: 'items', icon: Package, label: 'Items', color: '#616161', hover: '#515151', active: '#414141' },
    { id: 'vendors', icon: Building2, label: 'Vendors', color: '#757575', hover: '#656565', active: '#555555' },
    { id: 'reviews', icon: Star, label: 'Reviews', color: '#78909C', hover: '#68808C', active: '#58707C' },
    { id: 'settings', icon: Settings, label: 'Settings', color: '#90A4AE', hover: '#80949E', active: '#70848E' },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'}`}>
      {/* Left Sidebar - Wider */}
      <aside className={`w-[96px] ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white border-r border-gray-200'} flex flex-col items-center py-3 sticky top-0 h-screen`}>
        {/* Logo/Brand */}
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-3 text-white relative">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[11px] flex items-center justify-center text-white">
            10
          </span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-14 h-14 rounded-lg mb-3 flex items-center justify-center transition-colors ${
            darkMode ? 'bg-[#3D3D3D] text-gray-300 hover:bg-[#4D4D4D]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Menu Items */}
        <nav className="flex-1 w-full overflow-y-auto space-y-1.5 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPage(item.id)}
                style={{
                  backgroundColor: item.color,
                }}
                className="w-full flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-md transition-all text-white"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] text-center leading-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Employee Portal Button */}
        <button className="w-full px-2 mb-2">
          <div className="w-full flex flex-col items-center justify-center gap-1 py-2 rounded-md bg-[#6ECAA0] text-white hover:bg-[#5DB890] transition-colors">
            <Users className="w-5 h-5" />
            <span className="text-[10px] text-center leading-tight">Employee Portal</span>
          </div>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`${darkMode ? 'bg-[#2D2D2D] border-b border-[#3D3D3D]' : 'bg-white border-b border-gray-200'} sticky top-0 z-30`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Good Morning, John</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Here's what's happening with your business today.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  darkMode ? 'bg-[#3D3D3D] text-gray-300 hover:bg-[#4D4D4D]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <Search className="w-5 h-5" />
                </button>
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A024] to-[#B8860B] flex items-center justify-center overflow-hidden">
                  <span className="text-sm text-white">JD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-0 py-6">
          <div className="px-6 space-y-6">
            {/* Recent Job Photos */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <h2 className={darkMode ? 'text-white' : 'text-gray-900'}>Recent Job Photos</h2>
                </div>
                <button className="px-4 py-2 rounded-lg bg-[#D4A024] hover:bg-[#C08E1F] active:bg-[#A87A1A] text-white transition-colors text-sm flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>View All Photos</span>
                </button>
              </div>
              
              <div className="relative">
                {/* Left Arrow */}
                <button
                  onClick={handleScrollLeft}
                  disabled={photoScrollIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    photoScrollIndex === 0
                      ? 'bg-gray-400/50 cursor-not-allowed'
                      : darkMode
                        ? 'bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white'
                        : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
                  }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={handleScrollRight}
                  disabled={photoScrollIndex >= jobPhotos.length - 3}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    photoScrollIndex >= jobPhotos.length - 3
                      ? 'bg-gray-400/50 cursor-not-allowed'
                      : darkMode
                        ? 'bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white'
                        : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
                  }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Photo Container */}
                <div className="overflow-hidden px-12">
                  <div 
                    className="flex gap-4 transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${photoScrollIndex * (256 + 16)}px)` }}
                  >
                    {jobPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className={`w-64 h-40 rounded-lg flex-shrink-0 overflow-hidden relative group ${
                          darkMode ? 'border-2 border-[#3D3D3D]' : 'border-2 border-gray-200'
                        }`}
                      >
                        <ImageWithFallback
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <p className="text-sm">{photo.title}</p>
                            <p className="text-xs text-white/80">{photo.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: Math.max(1, jobPhotos.length - 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPhotoScrollIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        photoScrollIndex === index
                          ? 'bg-[#D4A024] w-6'
                          : darkMode
                            ? 'bg-[#3D3D3D] hover:bg-[#4D4D4D]'
                            : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Section - 2/3 of page */}
              <div className="space-y-6 lg:col-span-2">
                {/* Nested Grid: 2/3 for content, 1/3 empty */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Content Column - 2/3 */}
                  <div className="col-span-2 space-y-6">
                    {/* Today's Schedule */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className={`w-5 h-5 ${darkMode ? 'text-[#3B9CAA]' : 'text-[#1E88E5]'}`} />
                        <h2 className={darkMode ? 'text-[#3B9CAA]' : 'text-[#1E88E5]'}>Today's Schedule</h2>
                      </div>

                      <div className={`${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden`>
                        {/* Google Map - Taller */}
                        <iframe
                          src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=14520+E+Broadway+Ave+Spokane+Valley+WA+89037&destination=15420+E+Valleyway+Ave+Spokane+Valley+WA+89037&waypoints=16789+E+Appleway+Ave+Spokane+Valley+WA+89037&mode=driving"
                          className="w-full h-48 border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />

                        {/* Schedule List */}
                        <div className="divide-y divide-gray-200/10">
                          {todaysSchedule.map((appointment) => (
                            <div key={appointment.id} className="p-2 bg-[#0066CC] hover:bg-[#0052A3] transition-colors">
                              <div className="flex items-start gap-2">
                                <div className="flex items-center gap-1 text-white">
                                  <Clock3 className="w-3 h-3" />
                                  <span className="text-xs">{appointment.time}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-white text-sm">{appointment.client}</p>
                                  <div className="flex items-start gap-1 text-white/80 text-xs mt-0.5">
                                    <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                    <span>{appointment.address}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                                    <Phone className="w-3 h-3" />
                                    <span>{appointment.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Revenue Cards */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-200'} rounded-lg p-4 border`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This Month's Revenue</span>
                          <DollarSign className="w-5 h-5 text-[#66BB6A]" />
                        </div>
                        <p className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>${(stats.revenue / 1000).toFixed(0)}k</p>
                        <p className="text-sm text-[#66BB6A] mt-1">{stats.revenueChange} vs last month</p>
                      </div>

                      <div className={`${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-200'} rounded-lg p-4 border`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue Pending</span>
                          <Clock3 className="w-5 h-5 text-[#42A5F5]" />
                        </div>
                        <p className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>${(stats.revenuePending / 1000).toFixed(0)}k</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>8 signed contracts</p>
                      </div>

                      <div className={`${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-200'} rounded-lg p-4 border`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bonus Pool Forecast</span>
                          <TrendingUp className="w-5 h-5 text-[#FF9800]" />
                        </div>
                        <p className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>${(stats.bonusPool / 1000).toFixed(1)}k</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>P4P this month</p>
                      </div>
                    </div>

                    {/* Job Alerts */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h2 className="text-red-500">Job Alerts</h2>
                      </div>

                      <div className={`${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-200'} rounded-lg border divide-y ${darkMode ? 'divide-[#3D3D3D]' : 'divide-gray-200'}`}>
                        {jobAlerts.map((alert) => (
                          <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-[#3D3D3D]/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : 'bg-[#FF9800]'}`} />
                              <div>
                                <p className={darkMode ? 'text-white' : 'text-gray-900'}>{alert.title}</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{alert.subtitle}</p>
                              </div>
                            </div>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{alert.status}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Empty Column - 1/3 */}
                  <div className="col-span-1">
                    {/* Sales Pipeline */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-[#9C27B0]" />
                        <h2 className="text-[#9C27B0]">Sales Pipeline</h2>
                      </div>

                      <div className={`${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-200'} rounded-lg p-4 border space-y-3`}>
                        {salesPipeline.map((item, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.label}</span>
                              <span className={`text-sm px-2 py-1 rounded-full ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-100'}`} style={{ color: item.color }}>
                                {item.value}
                              </span>
                            </div>
                            {index === 0 && (
                              <div className="h-2 bg-[#3D3D3D] rounded-full overflow-hidden">
                                <div className="h-full bg-[#9C27B0]" style={{ width: '53%' }} />
                              </div>
                            )}
                            {index === 1 && (
                              <div className="h-2 bg-[#3D3D3D] rounded-full overflow-hidden">
                                <div className="h-full bg-[#00E676]" style={{ width: '75%' }} />
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Quote Conversion */}
                        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-[#1E4D3E] border border-[#2A6B52]' : 'bg-green-50 border border-green-200'}`}>
                          <p className="text-5xl text-[#00E676] text-center mb-2">53.3%</p>
                          <p className={`text-sm text-center ${darkMode ? 'text-[#66BB6A]' : 'text-green-700'}`}>Conversion Rate</p>
                          <p className="text-xs text-red-400 text-center mt-1">↑ 1.2% vs last month</p>
                        </div>

                        <div className={`pt-3 border-t ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-200'}`}>
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Revenue</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>$124,500</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg Quote Value</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>$15,562</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* Right Column - Client Experience */}
              <div className="space-y-6 lg:col-span-1">
                {/* Client Experience */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-[#FFB300]" />
                    <h2 className="text-[#FFB300]">Client Experience</h2>
                  </div>

                  <div className={`${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-200'} rounded-lg p-4 border space-y-4`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating This Month</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-[#FFB300] text-[#FFB300]" />
                          <span className={darkMode ? 'text-white' : 'text-gray-900'}>4.8</span>
                        </div>
                      </div>
                    </div>

                    <div className={`space-y-2 pt-4 border-t ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-200'}`}>
                      <div className="flex justify-between text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Review Requests Sent</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#42A5F5] text-white">24</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Reviews Pending</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#66BB6A] text-white">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Reviews Completed</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#66BB6A] text-white">16</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-[#3D3D3D]">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Likely Promoters</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#9C27B0] text-white">12</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}