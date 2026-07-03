import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ui/Toast';

const Landing = lazy(() => import('./pages/Landing'));
const MotivationLetter = lazy(() => import('./pages/MotivationLetter'));
const RecommendationLetter = lazy(() => import('./pages/RecommendationLetter'));

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-white" role="status" aria-label="Loading">
      <img
        src="/logo-risalatech.png"
        alt="RISALATECH"
        className="h-16 w-auto animate-pulse"
        style={{ animationDuration: '2s' }}
      />
    </div>
  );
}

function AppContent() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en';
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, [i18n.language]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
          <Route path="/motivation-letter" element={<Suspense fallback={<PageLoader />}><MotivationLetter /></Suspense>} />
          <Route path="/recommendation-letter" element={<Suspense fallback={<PageLoader />}><RecommendationLetter /></Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppContent />;
}
