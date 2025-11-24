import React from 'react';

const ReminderSettings: React.FC = () => {
  return (
    <div className="reminder-settings">
      <h2>Reminder Settings</h2>
      <label>
        Enable Notifications:
        <input type="checkbox" />
      </label>
    </div>
  );
};

export default ReminderSettings;
