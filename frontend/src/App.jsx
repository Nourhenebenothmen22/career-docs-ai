import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ui/Toast';
import useAppStore from './store/useAppStore';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const History = lazy(() => import('./pages/History'));
const MotivationLetter = lazy(() => import('./pages/MotivationLetter'));
const RecommendationLetter = lazy(() => import('./pages/RecommendationLetter'));
const Layout = lazy(() => import('./components/layout/Layout'));

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

function ProtectedRoute({ children }) {
  const token = useAppStore(s => s.token);
  return token ? children : <Navigate to="/login" replace />;
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
          {/* Public Routes */}
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />

          {/* Protected Shell Layout Routes */}
          <Route element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Layout /></Suspense></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/motivation-letter" element={<MotivationLetter />} />
            <Route path="/recommendation-letter" element={<RecommendationLetter />} />
          </Route>

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
