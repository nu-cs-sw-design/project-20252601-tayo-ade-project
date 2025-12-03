import React, { useState, useEffect, useCallback } from 'react';

interface ReminderNotificationProps {
  userId: string;
}

const ReminderNotification: React.FC<ReminderNotificationProps> = ({ userId }) => {
  const [showReminder, setShowReminder] = useState(false);
  const [showMissedReminder, setShowMissedReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Fetch reminder settings
  const fetchReminderSettings = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/reminders/${userId}`);
      const data = await response.json();
      if (data.data) {
        setReminderTime(data.data.time);
        setEnabled(Boolean(data.data.enabled));
      }
    } catch (err) {
      console.error('Failed to fetch reminder settings:', err);
    }
  }, [userId]);

  // Fetch settings on mount and every 30 seconds
  useEffect(() => {
    fetchReminderSettings();

    const fetchInterval = setInterval(fetchReminderSettings, 30000);
    return () => clearInterval(fetchInterval);
  }, [fetchReminderSettings]);

  // Listen for settings updates
  useEffect(() => {
    const handleSettingsUpdate = () => {
      fetchReminderSettings();
    };

    window.addEventListener('reminderSettingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('reminderSettingsUpdated', handleSettingsUpdate);
  }, [fetchReminderSettings]);

  // Check time every second
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      
      // Format current time in 24-hour format (HH:MM)
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeNow = `${hours}:${minutes}`;

      if (!enabled || !reminderTime) return;

      const today = now.toDateString();
      const lastShown = localStorage.getItem(`reminder_shown_${userId}`);

      // Check if current time matches reminder time
      if (timeNow === reminderTime && lastShown !== today) {
        setShowReminder(true);
        localStorage.setItem(`reminder_shown_${userId}`, today);
      }

      // Check for missed reminder (current time is past reminder time)
      if (lastShown !== today) {
        const [reminderHour, reminderMin] = reminderTime.split(':').map(Number);
        const [currentHour, currentMin] = timeNow.split(':').map(Number);
        
        const reminderMinutes = reminderHour * 60 + reminderMin;
        const currentMinutes = currentHour * 60 + currentMin;

        // If we're past the reminder time by more than 5 minutes
        if (currentMinutes > reminderMinutes + 5) {
          setShowMissedReminder(true);
          localStorage.setItem(`reminder_shown_${userId}`, today);
        }
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [enabled, reminderTime, userId]);

  const handleDismiss = () => {
    setShowReminder(false);
    setShowMissedReminder(false);
  };

  // On-time reminder
  if (showReminder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark overlay - click to close */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleDismiss}
        ></div>

        {/* Notification content */}
        <div className="relative backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 w-full max-w-md animate-bounce-in">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>

          {/* Bell icon with animation */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-yellow-500/30 flex items-center justify-center animate-bell">
              <span className="text-5xl">🔔</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight text-center">
            Time for Your Habits!
          </h2>

          <p className="text-gray-300 mb-6 text-center text-lg">
            It's <span className="text-yellow-400 font-semibold">{reminderTime}</span> - 
            don't forget to complete your daily habits!
          </p>

          {/* Motivational message */}
          <div className="p-4 backdrop-blur-md bg-white/5 rounded-xl border border-white/10 text-center mb-6">
            <p className="text-gray-300 italic">
              "Small daily improvements lead to stunning results."
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={handleDismiss}
            className="w-full p-4 backdrop-blur-md bg-green-500/80 text-white font-semibold rounded-xl
                       border border-green-400/30 shadow-lg shadow-green-500/25
                       hover:bg-green-500/90 hover:shadow-xl hover:shadow-green-500/30
                       active:scale-[0.98] transition-all duration-200 text-lg"
          >
            ✓ I'll Do My Habits Now!
          </button>

          <button
            onClick={handleDismiss}
            className="w-full mt-3 p-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // Missed reminder
  if (showMissedReminder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark overlay - click to close */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleDismiss}
        ></div>

        {/* Notification content */}
        <div className="relative backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 w-full max-w-md animate-bounce-in">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>

          {/* Warning icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-orange-500/30 flex items-center justify-center animate-pulse">
              <span className="text-5xl">⚠️</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight text-center">
            You Missed Your Reminder!
          </h2>

          <p className="text-gray-300 mb-4 text-center text-lg">
            Your reminder was set for <span className="text-orange-400 font-semibold">{reminderTime}</span>
          </p>

          <p className="text-gray-400 mb-6 text-center">
            It's not too late! Get back on track and complete your habits now.
          </p>

          {/* Motivational message */}
          <div className="p-4 backdrop-blur-md bg-orange-500/10 rounded-xl border border-orange-500/20 text-center mb-6">
            <p className="text-orange-300 italic">
              "It's not about being perfect. It's about showing up every day."
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={handleDismiss}
            className="w-full p-4 backdrop-blur-md bg-orange-500/80 text-white font-semibold rounded-xl
                       border border-orange-400/30 shadow-lg shadow-orange-500/25
                       hover:bg-orange-500/90 hover:shadow-xl hover:shadow-orange-500/30
                       active:scale-[0.98] transition-all duration-200 text-lg"
          >
            ✓ I'll Do My Habits Now!
          </button>

          <button
            onClick={handleDismiss}
            className="w-full mt-3 p-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Remind me later
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ReminderNotification;