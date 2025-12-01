import React, { useState } from 'react';

interface IHabitFormData {
  userId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

interface IHabitResponse {
  id: number;
  userId: string;
  name: string;
  frequency: string;
}

interface AddHabitProps {
  userId: string;
  onHabitAdded?: (habit: IHabitResponse) => void;
}

const AddHabit: React.FC<AddHabitProps> = ({ userId, onHabitAdded }) => {
  const [formData, setFormData] = useState<IHabitFormData>({
    userId: userId,
    name: '',
    frequency: 'daily'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/habits/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add habit');
      }

      const data: IHabitResponse = await response.json();
      setSuccess(true);

      setFormData({
        userId: userId,
        name: '',
        frequency: 'daily'
      });

      if (onHabitAdded) {
        onHabitAdded(data);
      }

      setTimeout(() => setSuccess(false), 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:bg-white/15">
      <h2 className="text-xl font-semibold mb-4 text-white tracking-tight">
        Add New Habit
      </h2>

      {error && (
        <div className="mb-4 p-3 backdrop-blur-md bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 backdrop-blur-md bg-green-500/20 text-green-300 rounded-xl border border-green-500/30 text-sm">
          Habit added successfully!
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Habit Name"
          required
          className="p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                     placeholder-gray-400 text-white transition-all duration-200
                     hover:bg-white/15"
        />

        <select
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          className="p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                     text-white transition-all duration-200 hover:bg-white/15
                     appearance-none cursor-pointer"
        >
          <option value="daily" className="bg-gray-800 text-white">Daily</option>
          <option value="weekly" className="bg-gray-800 text-white">Weekly</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="p-3 backdrop-blur-md bg-blue-500/80 text-white font-medium rounded-xl
                     border border-blue-400/30 shadow-lg shadow-blue-500/25
                     hover:bg-blue-500/90 hover:shadow-xl hover:shadow-blue-500/30
                     active:scale-[0.98] transition-all duration-200
                     disabled:bg-gray-400/50 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default AddHabit;