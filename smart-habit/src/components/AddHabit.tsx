import React from 'react';

const AddHabit: React.FC = () => {
  return (
    <div className="add-habit">
      <h2>Add New Habit</h2>
      <form>
        <input type="text" placeholder="Habit Name" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddHabit;
