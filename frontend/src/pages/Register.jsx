import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAppStore from '../store/useAppStore';
import { authApi } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAppStore(s => s.setAuth);
  const addToast = useAppStore(s => s.addToast);

  const from = location.state?.from?.pathname || '/recommendation-letter';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill all fields', 'warning');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.register(name, email, password);
      setAuth(res.data.user, res.data.accessToken);
      addToast('Account created successfully!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md !p-8 shadow-modal border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo-risalatech.png" alt="RISALATECH Logo" className="h-12 w-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mt-1">Get started with professional AI documents</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3.5 text-sm font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" state={{ from: location.state?.from }} className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
