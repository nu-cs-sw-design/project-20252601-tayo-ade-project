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

  // Fetch habits when component mounts, userId changes, or refreshTrigger changes
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

      // Remove from local state immediately
      setHabits(prev => prev.filter(habit => habit.id !== habitId));

      // Notify parent
      if (onHabitDeleted) {
        onHabitDeleted();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">My Habits</h2>
        <button 
          onClick={fetchHabits}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 text-center py-4">Loading habits...</p>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      {!loading && !error && habits.length === 0 && (
        <p className="text-gray-500 text-center py-4">No habits yet. Add one!</p>
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
  );
};

export default HabitList;