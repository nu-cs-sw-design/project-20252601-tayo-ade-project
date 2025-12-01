import React, { useState } from 'react';

interface ILoginFormData {
  email: string;
  password: string;
}

interface IUserResponse {
  id: string;
  username: string;
  email: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: IUserResponse) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<ILoginFormData & { username?: string }>({
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data: IUserResponse = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      onLoginSuccess(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-400 via-gray-700 to-black flex items-center justify-center p-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 w-full max-w-md transition-all duration-300 hover:shadow-xl hover:bg-white/15">
        <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">
          Smart Habit Tracker
        </h1>
        <h2 className="text-lg text-center text-gray-300 mb-6">
          {isLogin ? 'Login to your account' : 'Create an account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 backdrop-blur-md bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required={!isLogin}
              className="w-full p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                         placeholder-gray-400 text-white transition-all duration-200
                         hover:bg-white/15"
            />
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                       placeholder-gray-400 text-white transition-all duration-200
                       hover:bg-white/15"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                       placeholder-gray-400 text-white transition-all duration-200
                       hover:bg-white/15"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 backdrop-blur-md bg-blue-500/80 text-white font-medium rounded-xl
                       border border-blue-400/30 shadow-lg shadow-blue-500/25
                       hover:bg-blue-500/90 hover:shadow-xl hover:shadow-blue-500/30
                       active:scale-[0.98] transition-all duration-200
                       disabled:bg-gray-400/50 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-blue-700/80 hover:text-blue-800 transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;