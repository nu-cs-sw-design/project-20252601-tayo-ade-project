import React, { useState, useEffect } from 'react';

interface ReminderSettingsProps {
  userId: string;
}

const ReminderSettings: React.FC<ReminderSettingsProps> = ({ userId }) => {
  const [time, setTime] = useState('09:00');
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/reminders/${userId}`);
        const data = await response.json();
        if (data.data) {
          setTime(data.data.time || '09:00');
          setEnabled(Boolean(data.data.enabled));
        }
      } catch (err) {
        console.error('Failed to fetch reminder settings');
      }
    };
    fetchSettings();
  }, [userId]);

  const handleToggleEnabled = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnabled = e.target.checked;
    setEnabled(newEnabled);

    try {
      const response = await fetch(`http://localhost:3000/api/reminders/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time, enabled: newEnabled })
      });

      if (response.ok) {
        window.dispatchEvent(new CustomEvent('reminderSettingsUpdated'));
      }
    } catch (err) {
      console.error('Failed to update reminder setting');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:3000/api/reminders/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time, enabled })
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      window.dispatchEvent(new CustomEvent('reminderSettingsUpdated'));
      localStorage.removeItem(`reminder_shown_${userId}`);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:bg-white/15">
      <h2 className="text-xl font-semibold mb-4 text-white tracking-tight">Reminders</h2>

      {error && (
        <div className="mb-4 p-3 backdrop-blur-md bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 backdrop-blur-md bg-green-500/20 text-green-300 rounded-xl border border-green-500/30 text-sm">
          Settings saved!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Enable toggle */}
        <div className="flex items-center gap-3 p-3 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
          <input
            type="checkbox"
            id="enabled"
            checked={enabled}
            onChange={handleToggleEnabled}
            className="w-5 h-5 rounded-md border-white/20 text-blue-500 focus:ring-blue-400/50 bg-white/10"
          />
          <label htmlFor="enabled" className="text-white">
            Enable daily reminders
          </label>
        </div>

        {/* Time picker */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Reminder Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!enabled}
            className="w-full p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                       text-white transition-all duration-200 hover:bg-white/15
                       disabled:bg-white/5 disabled:cursor-not-allowed disabled:text-gray-500"
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 backdrop-blur-md bg-blue-500/80 text-white font-medium rounded-xl
                     border border-blue-400/30 shadow-lg shadow-blue-500/25
                     hover:bg-blue-500/90 hover:shadow-xl hover:shadow-blue-500/30
                     active:scale-[0.98] transition-all duration-200
                     disabled:bg-gray-400/50 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default ReminderSettings;