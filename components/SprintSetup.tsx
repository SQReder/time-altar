
import React, { useState } from 'react';

interface SprintSetupProps {
  onCreate: (startDate: Date) => void;
}

const SprintSetup: React.FC<SprintSetupProps> = ({ onCreate }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate) {
      onCreate(new Date(startDate));
    }
  };

  return (
    <div className="bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800 w-full max-w-md text-center">
      <h2 className="text-3xl font-bold text-amber-400 mb-2">Начать Новый Спринт</h2>
      <p className="text-zinc-400 mb-6">Выберите дату начала вашего 10-дневного ритуала.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg p-3 w-full text-center focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-amber-600 text-zinc-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          Возжечь Пламя
        </button>
      </form>
    </div>
  );
};

export default SprintSetup;
