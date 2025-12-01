import React from 'react';

interface IHabitItemProps {
  id: number;
  name: string;
  frequency: string;
  onDelete: (id: number) => void;
}

const HabitItem: React.FC<IHabitItemProps> = ({ id, name, frequency, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 backdrop-blur-md bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
      <div>
        <h3 className="font-medium text-white">{name}</h3>
        <p className="text-sm text-gray-400 capitalize">{frequency}</p>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="px-3 py-1 backdrop-blur-md bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 
                   hover:bg-red-500/30 active:scale-95 transition-all duration-200 text-sm"
      >
        Delete
      </button>
    </div>
  );
};

export default HabitItem;