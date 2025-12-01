import React from 'react';

const LogHabit: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Log Habit</h2>
      <form className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Select Habit:
          <select className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Habit 1</option>
            <option>Habit 2</option>
          </select>
        </label>
        <button 
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Log Completion
        </button>
      </form>
    </div>
  );
};

export default LogHabit;
