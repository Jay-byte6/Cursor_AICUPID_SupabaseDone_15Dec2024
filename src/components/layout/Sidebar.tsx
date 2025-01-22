import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Home,
  User,
  Heart,
  Users,
  Settings,
  MessageCircle,
  Brain,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { colors } = useTheme();

  const menuItems = [
    { path: '/home', icon: Home, name: 'Home' },
    { path: '/profile', icon: User, name: 'Your Persona' },
    { path: '/personality-analysis', icon: Brain, name: 'Personality Analysis' },
    { path: '/smart-matching', icon: Heart, name: 'Smart Matching' },
    { path: '/relationship-insights', icon: Users, name: 'Relationship Insights' },
    { path: '/chat', icon: MessageCircle, name: 'AI Chat Assistant' },
    { path: '/settings', icon: Settings, name: 'Settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const primaryColor = colors.primary === 'pink-500' ? 'pink-500' : 'blue-500';
  const lightColor = colors.light === 'pink-50' ? 'pink-50' : 'blue-50';
  const borderColor = colors.border === 'pink-100' ? 'pink-100' : 'blue-100';

  return (
    <div className={`w-64 h-screen bg-white border-r border-${borderColor} fixed left-0 top-0 pt-16`}>
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? `bg-${primaryColor} text-white`
                      : `text-gray-700 hover:bg-${lightColor} hover:text-${primaryColor}`
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-white' : `text-${primaryColor}`} mr-3`} />
                  <span>{item.name}</span>
                  {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 