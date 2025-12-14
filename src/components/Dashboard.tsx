import { useState } from 'react';
import { 
  Camera, 
  Calendar, 
  Clock3, 
  DollarSign, 
  MapPin, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Menu,
  Bell,
  Settings,
  LogOut,
  Briefcase,
  Home,
  MessageSquare,
  UserCircle,
  FileText,
  ClipboardList,
  FileSignature,
  Package,
  Building2
} from 'lucide-react';
import { Job } from '../App';

type DashboardProps = {
  jobs: Job[];
  onOpenCamera: (job: Job) => void;
  onViewJobProgress: (job: Job) => void;
  onViewCollections: (job: Job) => void;
  currentEmployee: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
};

export function Dashboard({ 
  jobs, 
  onOpenCamera, 
  onViewJobProgress,
  onViewCollections,
  currentEmployee 
}: DashboardProps) {
  const [selectedView, setSelectedView] = useState<'today' | 'week' | 'all'>('today');
  const [showMenu, setShowMenu] = useState(false);

  // Mock data for dashboard stats
  const todayJobs = jobs.filter(j => j.assignedEmployees.includes(currentEmployee.id));
  const completedToday = 2;
  const hoursLogged = 6.5;
  const weeklyEarnings = 1850;

  // Mock notifications
  const notifications = [
    { id: 1, type: 'photo', message: 'Daily photo required for Anderson Residence', urgent: true },
    { id: 2, type: 'task', message: 'Martinez Kitchen ready for final inspection', urgent: false },
  ];

  const getJobStatusColor = (job: Job) => {
    // Mock logic - in real app would check actual status
    return 'bg-amber-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#4F6A41] to-[#55624C] text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg">Boardroom 360</h1>
                <p className="text-xs text-white/80">Employee Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                <span className="text-sm">{currentEmployee.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-4 pb-4 grid grid-cols-4 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xl">{todayJobs.length}</div>
            <div className="text-xs text-white/70">Active Jobs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xl">{completedToday}</div>
            <div className="text-xs text-white/70">Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xl">{hoursLogged}</div>
            <div className="text-xs text-white/70">Hours Today</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xl">${weeklyEarnings}</div>
            <div className="text-xs text-white/70">This Week</div>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col">
            {/* Menu Header */}
            <div className="p-6 bg-gradient-to-r from-[#4F6A41] to-[#55624C] text-white">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg">
                  <span>{currentEmployee.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-lg">{currentEmployee.name}</p>
                  <p className="text-sm text-white/80">{currentEmployee.role}</p>
                </div>
              </div>
            </div>
            
            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-2">
              <div className="px-3 space-y-1">
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg bg-[#4F6A41] text-white transition-colors">
                  <Home className="w-5 h-5" />
                  <span className="text-sm">Dashboard</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Messages</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-sm">My Jobs</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Schedule</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <ClipboardList className="w-5 h-5" />
                  <span className="text-sm">Work Orders</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <Clock3 className="w-5 h-5" />
                  <span className="text-sm">Timesheet</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">Camera</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm">Pay & Performance</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-3 px-3">
                <div className="border-t border-gray-200" />
              </div>

              {/* Settings Section */}
              <div className="px-3 space-y-1">
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">My Settings</span>
                </button>
              </div>
            </nav>

            {/* Sign Out at Bottom */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Notifications Banner */}
      {notifications.some(n => n.urgent) && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-900">
                {notifications.find(n => n.urgent)?.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* View Toggle */}
        <div className="px-4 pt-4 pb-3 bg-white border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('today')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedView === 'today'
                  ? 'bg-[#3B9CAA] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedView('week')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedView === 'week'
                  ? 'bg-[#3B9CAA] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setSelectedView('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedView === 'all'
                  ? 'bg-[#3B9CAA] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Jobs
            </button>
          </div>
        </div>

        {/* Today's Priority Section */}
        <section className="p-4 bg-gradient-to-br from-[#3B9CAA]/5 to-[#4F6A41]/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#4F6A41] flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Today's Priority
            </h2>
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-[#3B9CAA] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3B9CAA]/10 flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-[#3B9CAA]" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-900">Clock In</p>
                  <p className="text-xs text-gray-600">Start your day</p>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-[#3B9CAA] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4F6A41]/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#4F6A41]" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-900">P4P Status</p>
                  <p className="text-xs text-gray-600">View earnings</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Active Jobs List */}
        <section className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#4F6A41] flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Active Jobs
            </h2>
            <span className="text-sm text-gray-600">{todayJobs.length} jobs</span>
          </div>

          <div className="space-y-3">
            {todayJobs.map(job => (
              <div key={job.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Status Bar */}
                <div className={`h-1 ${getJobStatusColor(job)}`} />
                
                {/* Job Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-[#4F6A41]">{job.clientName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.jobName}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{job.address}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-[#4F6A41]/10 text-[#4F6A41] text-xs rounded-full whitespace-nowrap">
                      {job.jobType}
                    </span>
                  </div>

                  {/* Job Info Pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.calibration && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Calibrated
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      <Users className="w-3 h-3" />
                      {job.assignedEmployees.length} crew
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onOpenCamera(job)}
                      className="bg-[#3B9CAA] hover:bg-[#3B9CAA]/90 text-white rounded-lg px-3 py-2 flex items-center justify-center gap-2 text-sm active:scale-[0.98] transition-transform"
                    >
                      <Camera className="w-4 h-4" />
                      Camera
                    </button>
                    <button
                      onClick={() => onViewCollections(job)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm"
                    >
                      Media
                    </button>
                    <button
                      onClick={() => onViewJobProgress(job)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm"
                    >
                      Progress
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Card */}
        <section className="p-4">
          <div className="bg-gradient-to-br from-[#4F6A41] to-[#55624C] rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pay for Performance
              </h3>
              <TrendingUp className="w-5 h-5" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-white/70 text-sm">This Week</p>
                <p className="text-2xl mt-1">${weeklyEarnings}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">This Month</p>
                <p className="text-2xl mt-1">$7,240</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-2 overflow-hidden mb-2">
              <div className="bg-white h-full w-3/4 rounded-full" />
            </div>
            <p className="text-xs text-white/70">75% to next bonus tier</p>
          </div>
        </section>

        {/* Bottom Spacing */}
        <div className="h-20" />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-30 shadow-lg">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-[#4F6A41]/10 text-[#4F6A41]">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Briefcase className="w-5 h-5" />
            <span className="text-xs">Jobs</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Camera className="w-5 h-5" />
            <span className="text-xs">Camera</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Clock3 className="w-5 h-5" />
            <span className="text-xs">Time</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Pay</span>
          </button>
        </div>
      </nav>
    </div>
  );
}