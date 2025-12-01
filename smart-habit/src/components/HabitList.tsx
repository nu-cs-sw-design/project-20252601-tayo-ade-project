import React, { useState, useEffect } from 'react';
import HabitItem from './HabitItem';

interface IHabit {
  id: number;
  user_id: string;
  name: string;
  frequency: string;
}

interface IHabitListProps {
  userId: string;
  refreshTrigger?: number;
  onHabitDeleted?: () => void;
}

const HabitList: React.FC<IHabitListProps> = ({ userId, refreshTrigger, onHabitDeleted }) => {
  const [habits, setHabits] = useState<IHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/habits/${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch habits');
      }

      const data = await response.json();
      setHabits(data.data || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHabits();
    }
  }, [userId, refreshTrigger]);

  const handleDelete = async (habitId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/habits/${habitId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete habit');
      }

      setHabits(prev => prev.filter(habit => habit.id !== habitId));

      if (onHabitDeleted) {
        onHabitDeleted();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="relative group backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:bg-white/20 overflow-hidden">
      {/* Shimmer overlay - shows on idle, hides on hover */}
      <div className="absolute inset-0 animate-shimmer opacity-50 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white tracking-tight">My Habits</h2>
          <button 
            onClick={fetchHabits}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <p className="text-gray-400 text-center py-4">Loading habits...</p>
        )}

        {error && (
          <div className="p-3 backdrop-blur-md bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 mb-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && habits.length === 0 && (
          <p className="text-gray-400 text-center py-4">No habits yet. Add one!</p>
        )}

        <div className="space-y-3">
          {habits.map(habit => (
            <HabitItem 
              key={habit.id}
              id={habit.id}
              name={habit.name}
              frequency={habit.frequency}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitList;