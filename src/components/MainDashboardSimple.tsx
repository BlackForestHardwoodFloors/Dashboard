import { useState } from 'react';
import { Home, Moon, Sun } from 'lucide-react';

export function MainDashboardSimple() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`w-24 ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white border-r border-gray-200'} flex flex-col items-center py-6`}>
        <div className="w-12 h-12 rounded-full bg-[#D4A024] flex items-center justify-center mb-6">
          <Home className="w-6 h-6 text-white" />
        </div>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            darkMode ? 'bg-[#3D3D3D] text-white' : 'bg-gray-200 text-gray-900'
          }`}
        >
          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <h1 className="text-3xl mb-4">Boardroom 360 Dashboard</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Dashboard is loading successfully! ✅
          </p>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className={`${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'} p-6 rounded-lg border ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-200'}`}>
              <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Active Jobs</h3>
              <p className="text-3xl text-[#D4A024] mt-2">24</p>
            </div>
            
            <div className={`${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'} p-6 rounded-lg border ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-200'}`}>
              <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Revenue</h3>
              <p className="text-3xl text-[#66BB6A] mt-2">$284k</p>
            </div>
            
            <div className={`${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'} p-6 rounded-lg border ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-200'}`}>
              <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Team</h3>
              <p className="text-3xl text-[#42A5F5] mt-2">32</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-500 text-white rounded-lg">
            ✅ If you see this, the app is working! The Figma errors are from their platform, not your code.
          </div>
        </div>
      </div>
    </div>
  );
}
