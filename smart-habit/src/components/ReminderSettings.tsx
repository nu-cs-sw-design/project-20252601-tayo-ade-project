import React from 'react';

const ReminderSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Reminder Settings</h2>
      <label className="flex items-center gap-3 cursor-pointer">
        <span className="text-gray-700">Enable Notifications:</span>
        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
      </label>
    </div>
  );
};

export default ReminderSettings;
