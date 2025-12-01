import React, { useState, useEffect } from 'react';

interface IHabit {
  id: number;
  name: string;
}

interface LogHabitProps {
  userId: string;
  refreshTrigger?: number;
}

const LogHabit: React.FC<LogHabitProps> = ({ userId, refreshTrigger }) => {
  const [habits, setHabits] = useState<IHabit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/habits/${userId}`);
        const data = await response.json();
        setHabits(data.data || []);
      } catch (err) {
        console.error('Failed to fetch habits');
      }
    };
    fetchHabits();
  }, [userId, refreshTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabitId) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId: selectedHabitId, date })
      });

      if (!response.ok) {
        throw new Error('Failed to log habit');
      }

      setSuccess(true);
      setSelectedHabitId('');
      setTimeout(() => setSuccess(false), 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:bg-white/15">
      <h2 className="text-xl font-semibold mb-4 text-white tracking-tight">Log Completion</h2>

      {error && (
        <div className="mb-4 p-3 backdrop-blur-md bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 backdrop-blur-md bg-green-500/20 text-green-300 rounded-xl border border-green-500/30 text-sm">
          Habit logged successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={selectedHabitId}
          onChange={(e) => setSelectedHabitId(Number(e.target.value))}
          required
          className="p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent
                     text-white transition-all duration-200 hover:bg-white/15
                     appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-800 text-white">Select a habit</option>
          {habits.map(habit => (
            <option key={habit.id} value={habit.id} className="bg-gray-800 text-white">{habit.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent
                     text-gray-800 transition-all duration-200 hover:bg-white/60"
        />

        <button
          type="submit"
          disabled={loading || !selectedHabitId}
          className="p-3 backdrop-blur-md bg-green-500/80 text-white font-medium rounded-xl
                     border border-green-400/30 shadow-lg shadow-green-500/25
                     hover:bg-green-500/90 hover:shadow-xl hover:shadow-green-500/30
                     active:scale-[0.98] transition-all duration-200
                     disabled:bg-gray-400/50 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? 'Logging...' : 'Log Completion'}
        </button>
      </form>
    </div>
  );
};

export default LogHabit;