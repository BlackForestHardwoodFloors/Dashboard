import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  Calendar, 
  Settings 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-boardroom-accent">
          Boardroom
        </h2>
      </div>
      <nav className="mt-10">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.label} 
            className={`
              px-6 py-3 flex items-center 
              ${location.pathname === item.path 
                ? 'bg-boardroom-accent text-black' 
                : 'hover:bg-gray-800'
              } 
              cursor-pointer
            `}
          >
            <item.icon className="mr-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;