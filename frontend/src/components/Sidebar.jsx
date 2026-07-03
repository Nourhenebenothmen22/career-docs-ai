import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/motivation-letter', label: 'Motivation Letter', icon: DocumentTextIcon },
  { to: '/recommendation-letter', label: 'Recommendation Letter', icon: AcademicCapIcon },
  { to: '/history', label: 'History', icon: ClockIcon },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
          <DocumentTextIcon className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">CareerDocs AI</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-400">CareerDocs AI v1.0</p>
      </div>
    </aside>
  );
}
