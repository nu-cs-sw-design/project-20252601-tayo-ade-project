import React from 'react';
import HabitList from './HabitList';
import AddHabit from './AddHabit';
import LogHabit from './LogHabit';
import ReportPage from './ReportPage';
import ReminderSettings from './ReminderSettings';

const MainScreen: React.FC = () => {
  return (
    <div className="main-screen">
      <h1>Smart Habit Tracker</h1>
      <div className="dashboard">
        <HabitList />
        <div className="actions">
          <AddHabit />
          <LogHabit />
        </div>
      </div>
      <div className="settings-reports">
        <ReportPage />
        <ReminderSettings />
      </div>
    </div>
  );
};

export default MainScreen;
