import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MotivationLetter = lazy(() => import('./pages/MotivationLetter'));
const RecommendationLetter = lazy(() => import('./pages/RecommendationLetter'));
const History = lazy(() => import('./pages/History'));

function PageLoader() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
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
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="/motivation-letter" element={<Suspense fallback={<PageLoader />}><MotivationLetter /></Suspense>} />
            <Route path="/recommendation-letter" element={<Suspense fallback={<PageLoader />}><RecommendationLetter /></Suspense>} />
            <Route path="/history" element={<Suspense fallback={<PageLoader />}><History /></Suspense>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppContent />;
}
