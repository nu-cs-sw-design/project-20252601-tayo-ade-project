import React from 'react';

const LogHabit: React.FC = () => {
  return (
    <div className="log-habit">
      <h2>Log Habit</h2>
      <form>
        <label>
          Select Habit:
          <select>
            <option>Habit 1</option>
            <option>Habit 2</option>
          </select>
        </label>
        <button type="submit">Log Completion</button>
      </form>
    </div>
  );
};

export default LogHabit;
