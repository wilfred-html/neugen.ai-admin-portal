import React, { useState } from 'react';
import { UserIcon, LockClosedIcon } from '../components/icons/Icons';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Left Panel - Image and Logo */}
      <div className="w-1/2 relative hidden lg:flex flex-col items-center justify-center text-center p-8">
       
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-white">
            <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center text-text-on-primary font-bold text-5xl mb-6 mx-auto">
              N
            </div>
            <h1 className="text-5xl font-bold tracking-wider">NeuGen.AI</h1>
            <p className="text-lg text-text-light-minor/80 mt-3 max-w-sm">
              Your Top Sales Performer, Powered by AI.
            </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 text-text-light-major">
        <div className="w-full max-w-md">
            <div className='lg:hidden mb-10 text-center'>
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-text-on-primary font-bold text-4xl mb-4 mx-auto">
                    N
                </div>
                <h1 className="text-3xl font-bold tracking-wider">NeuGen.AI</h1>
            </div>

            <h2 className="text-3xl font-bold">SIGN IN</h2>
            <div className="w-16 h-1 bg-primary my-4"></div>
            <p className="text-text-light-minor mb-8">
                Please enter your credentials to access the portal.
            </p>

            <form className="space-y-6" onSubmit={handleLogin}>
                <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-minor" />
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full px-3 py-3 pl-12 bg-bg-dark border border-border-dark placeholder-text-light-minor text-text-light-major rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                
                <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-minor" />
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full px-3 py-3 pl-12 bg-bg-dark border border-border-dark placeholder-text-light-minor text-text-light-major rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>

                <div className='flex items-center justify-between'>
                    <div className='text-xs text-text-light-minor'>
                    </div>
                    <a href="#" className="text-sm font-medium text-primary hover:text-secondary">Forgot Password?</a>
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border-2 border-primary bg-transparent text-primary text-sm font-bold rounded-md hover:bg-primary hover:text-text-on-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
