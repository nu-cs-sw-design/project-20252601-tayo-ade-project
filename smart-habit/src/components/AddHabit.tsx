import React from 'react';
import { useState } from 'react';

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

      // Reset form
      setFormData({
        userId: userId,
        name: '',
        frequency: 'daily'
      });

      if (onHabitAdded) {
        onHabitAdded(data);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Habit</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
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
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select 
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default AddHabit;