import React, { useState } from 'react';
import HabitList from './HabitList';
import AddHabit from './AddHabit';
import LogHabit from './LogHabit';
import ReportPage from './ReportPage';
import ReminderSettings from './ReminderSettings';

interface MainScreenProps {
  userId: string;
}

const MainScreen: React.FC<MainScreenProps> = ({ userId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleHabitAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleHabitDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Background decorative blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-60 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <h1 className="text-3xl font-bold text-center text-white mb-8 tracking-tight drop-shadow-lg relative z-10">
        Smart Habit Tracker
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="md:col-span-2 space-y-6">
          {/* HabitList with float animation */}
          <div className="animate-float hover-pause">
            <HabitList 
              userId={userId} 
              refreshTrigger={refreshTrigger}
              onHabitDeleted={handleHabitDeleted}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AddHabit with delayed float */}
            <div className="animate-float-delayed hover-pause">
              <AddHabit userId={userId} onHabitAdded={handleHabitAdded} />
            </div>

            {/* LogHabit with more delayed float */}
            <div className="animate-float-delayed-2 hover-pause">
              <LogHabit userId={userId} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* ReportPage with breathe animation */}
          <div className="animate-breathe hover-pause">
            <ReportPage userId={userId} refreshTrigger={refreshTrigger} />
          </div>

          {/* ReminderSettings with pulse glow */}
          <div className="animate-pulse-glow hover-pause">
            <ReminderSettings userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;