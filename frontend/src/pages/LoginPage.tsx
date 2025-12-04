import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md">
          <LoginForm onSuccess={handleLoginSuccess} />
          
          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};