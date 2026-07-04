import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import useAppStore from '../../store/useAppStore';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppStore(s => s.user);
  const logout = useAppStore(s => s.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2.5">
              <img src="/logo-risalatech.png" alt="RISALATECH" className="h-8 w-auto" />
              <span className="hidden sm:inline text-caption font-bold text-gray-900">{t('app.name')}</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {user && (
              <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                <div className="hidden md:block text-right">
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

        </div>
      </div>
    </header>
  );
}
