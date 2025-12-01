import React from 'react';
import HabitItem from './HabitItem';

const HabitList: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">My Habits</h2>
      <div className="space-y-3">
        <HabitItem />
        <HabitItem />
        <HabitItem />
      </div>
    </div>
  );
};

export default HabitList;
