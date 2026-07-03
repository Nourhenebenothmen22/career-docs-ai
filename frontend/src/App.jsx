import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MotivationLetter from './pages/MotivationLetter';
import RecommendationLetter from './pages/RecommendationLetter';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/motivation-letter" element={<MotivationLetter />} />
          <Route path="/recommendation-letter" element={<RecommendationLetter />} />
          <Route path="/history" element={<History />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
