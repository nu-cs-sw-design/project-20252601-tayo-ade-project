import React from 'react';

const HabitItem: React.FC = () => {
  return (
    <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
      <h3 className="font-medium text-gray-800">Habit Name</h3>
      <p className="text-sm text-gray-500">Habit Description</p>
    </div>
  );
};

export default HabitItem;
