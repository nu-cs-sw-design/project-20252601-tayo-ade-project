import React from 'react';

const AddHabit: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Habit</h2>
      <form className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Habit Name" 
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddHabit;
