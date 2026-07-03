import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from '../ui/Toast';
import useAppStore from '../../store/useAppStore';

function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-sm text-gray-400">{t('common.loading')}</p>
      </div>
    </div>
  );
}

export default function Layout() {
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          sidebarOpen
            ? isRtl ? 'mr-64' : 'ml-64'
            : isRtl ? 'mr-16' : 'ml-16'
        }`}
      >
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
