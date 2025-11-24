import React from 'react';
import HabitItem from './HabitItem';

const HabitList: React.FC = () => {
  return (
    <div className="habit-list">
      <h2>My Habits</h2>
      <HabitItem />
      <HabitItem />
      <HabitItem />
    </div>
  );
};

export default HabitList;
