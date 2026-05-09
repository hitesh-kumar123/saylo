import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-4xl text-ink tracking-wide">
            SAY<span className="text-muted italic font-serif lowercase">lo</span>
          </Link>
          <p className="text-muted mt-2 text-sm uppercase tracking-widest">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="saylo-card p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-sm bg-red-100 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-ink/70 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-ink/10 rounded-sm px-4 py-3 text-ink focus:outline-none focus:border-ink transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-ink/70 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-ink/10 rounded-sm px-4 py-3 text-ink focus:outline-none focus:border-ink transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-sm bg-ink hover:bg-ink/90 text-paper font-semibold tracking-wider uppercase text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-paper/20 border-t-paper rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-ink font-semibold border-b border-ink/30 hover:border-ink pb-0.5 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
