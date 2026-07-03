import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon, DocumentTextIcon, AcademicCapIcon, ClockIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';
import useAppStore from '../../store/useAppStore';

const navItems = (t) => [
  { to: '/dashboard', label: t('nav.dashboard'), icon: HomeIcon },
  { to: '/motivation-letter', label: t('nav.motivationLetter'), icon: DocumentTextIcon },
  { to: '/recommendation-letter', label: t('nav.recommendationLetter'), icon: AcademicCapIcon },
  { to: '/history', label: t('nav.history'), icon: ClockIcon },
];

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);
  const isRtl = i18n.language === 'ar';

  return (
    <aside
      className={`fixed top-0 z-40 flex h-screen flex-col border-gray-200 bg-white transition-all duration-300 ${
        isRtl ? 'right-0 border-l' : 'left-0 border-r'
      } ${sidebarOpen ? 'w-64' : 'w-16'}`}
    >
      <div className={`flex h-16 items-center border-b border-gray-200 ${sidebarOpen ? 'gap-3 px-5' : 'justify-center px-2'}`}>
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600">
          <DocumentTextIcon className="h-5 w-5 text-white" />
        </div>
        {sidebarOpen && <span className="whitespace-nowrap text-base font-bold text-gray-900">{t('app.name')}</span>}
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems(t).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } ${!sidebarOpen && 'justify-center px-2'}`
            }
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon className={`flex-shrink-0 ${sidebarOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title={sidebarOpen ? 'Collapse' : 'Expand'}
        >
          {sidebarOpen ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
