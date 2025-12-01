import React from 'react';
import HabitList from './HabitList';
import AddHabit from './AddHabit';
import LogHabit from './LogHabit';
import ReportPage from './ReportPage';
import ReminderSettings from './ReminderSettings';

const MainScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Smart Habit Tracker</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <HabitList />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddHabit />
            <LogHabit />
          </div>
        </div>
        <div className="space-y-6">
          <ReportPage />
          <ReminderSettings />
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
