import React from 'react';

interface IHabitItemProps {
  id: number;
  name: string;
  frequency: string;
  onDelete: (id: number) => void;
}

const HabitItem: React.FC<IHabitItemProps> = ({ id, name, frequency, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
      <div>
        <h3 className="font-medium text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{frequency}</p>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Delete
      </button>
    </div>
  );
};

export default HabitItem;