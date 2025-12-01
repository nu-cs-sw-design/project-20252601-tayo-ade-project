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
  // This counter triggers a refresh when incremented
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleHabitAdded = () => {
    // Increment to trigger HabitList useEffect
    setRefreshTrigger(prev => prev + 1);
    console.log('Habit added, refreshing list...');
  };

  const handleHabitDeleted = () => {
    // Also refresh after delete
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Smart Habit Tracker</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <HabitList 
            userId={userId} 
            refreshTrigger={refreshTrigger}
            onHabitDeleted={handleHabitDeleted}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddHabit userId={userId} onHabitAdded={handleHabitAdded} />
            <LogHabit userId={userId} refreshTrigger={refreshTrigger} />
          </div>
        </div>
        <div className="space-y-6">
          <ReportPage userId={userId} refreshTrigger={refreshTrigger} />
          <ReminderSettings userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default MainScreen;