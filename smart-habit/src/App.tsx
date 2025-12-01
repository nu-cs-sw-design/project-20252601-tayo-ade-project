import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainScreen from './components/MainScreen';

interface IUser {
  id: string;
  username: string;
  email: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);

  // Check for existing user session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: IUser) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Show login page if not logged in
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if logged in
  return (
    <div>
      {/* Header with logout */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-gray-600">
            Welcome, <strong>{user.username}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </header>
      
      <MainScreen userId={user.id} />
    </div>
  );
};

export default App;