import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ui/Toast';
import useAppStore from './store/useAppStore';
import Header from './components/layout/Header';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
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

function ProtectedRoute({ children }) {
  const token = useAppStore(s => s.token);
  const location = useLocation();
  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function RootRedirector() {
  const token = useAppStore(s => s.token);
  return token ? <Navigate to="/recommendation-letter" replace /> : <Landing />;
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
        {/* Global Suspense boundary catches lazy loaded components and prevents React Minified Error #426 */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<RootRedirector />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/motivation-letter" element={<MotivationLetter />} />
              <Route path="/recommendation-letter" element={<RecommendationLetter />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppContent />;
}
