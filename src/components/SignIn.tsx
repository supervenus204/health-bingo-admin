import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password, role: 'admin' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bingo-mint to-bingo-sky/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border border-gray-light-medium">
        <div className="text-center mb-8">
          <img
            src="/icon.png"
            alt="Health Bingo"
            className="w-16 h-16 mx-auto mb-4 rounded-lg"
          />
          <h1 className="text-3xl font-bold text-primary-blue">Admin Portal</h1>
          <p className="text-text-secondary mt-2">Sign in to manage Health Bingo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-error text-error px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
              placeholder="Input your email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
              placeholder="Input your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-green hover:bg-bingo-forest text-white font-medium py-3 px-4 rounded-full transition-all hover:shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
