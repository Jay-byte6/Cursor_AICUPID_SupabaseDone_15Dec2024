import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeMap: Record<string, string> = {
  '': 'Home',
  'home': 'Dashboard',
  'login': 'Login',
  'signup': 'Sign Up',
  'registration': 'Registration',
  'personality-analysis': 'Personality Analysis',
  'smart-matching': 'Smart Matching',
  'relationship-insights': 'Relationship Insights',
  'profile': 'Profile',
  'settings': 'Settings',
  'test-personality': 'Test Personality'
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  // Don't show breadcrumb on landing page
  if (location.pathname === '/') {
    return null;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = pathnames.map((path, index) => {
    const routePath = pathnames.slice(0, index + 1).join('/');
    return {
      label: routeMap[path] || path,
      path: `/${routePath}`
    };
  });

  // Always include Home as the first breadcrumb
  breadcrumbs.unshift({ label: 'Dashboard', path: '/home' });

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.path}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-600 font-medium">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;