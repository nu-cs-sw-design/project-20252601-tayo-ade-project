import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainScreen from './components/MainScreen';
import ReminderNotification from './components/ReminderNotification';

interface IUser {
  id: string;
  username: string;
  email: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);

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

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-gradient-to-b from-gray-400 via-gray-700 to-black min-h-screen">
      <header className="backdrop-blur-xl bg-black/30 border-b border-white/10 p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-white">
            Welcome, <strong>{user.username}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 backdrop-blur-md bg-red-500/30 text-red-300 rounded-xl border border-red-500/30 
                       hover:bg-red-500/40 active:scale-95 transition-all duration-200 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <MainScreen userId={user.id} />

      {/* Auto-show reminder at scheduled time */}
      <ReminderNotification userId={user.id} />
    </div>
  );
};

export default App;