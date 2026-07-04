import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import useAppStore from '../../store/useAppStore';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const user = useAppStore(s => s.user);
  const logout = useAppStore(s => s.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        {user && (
          <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-gray-900">{user.name}</p>
              <p className="text-[10px] text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Log Out"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
