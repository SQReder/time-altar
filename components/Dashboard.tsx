
import React from 'react';
import { Sprint, SprintDay, SlotType, SlotStatus } from '../types';

interface DashboardProps {
  sprint: Sprint;
  today: SprintDay | undefined;
  onReset: () => void;
}

const StatCard: React.FC<{ title: string; value: React.ReactNode; className?: string }> = ({ title, value, className = '' }) => (
  <div className={`bg-zinc-900 p-4 rounded-lg border border-zinc-800 text-center ${className}`}>
    <dt className="text-sm text-zinc-500">{title}</dt>
    <dd className="text-2xl font-bold text-amber-400">{value}</dd>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ sprint, today, onReset }) => {
  const totalFlames = 80; // 10 days * 8 flames
  const totalEmbers = 40; // 10 days * 4 embers

  const spentFlames = sprint.days.flatMap(d => d.slots).filter(s => s.type === SlotType.Flame && s.status === SlotStatus.Spent).length;
  const spentEmbers = sprint.days.flatMap(d => d.slots).filter(s => s.type === SlotType.Ember && s.status === SlotStatus.Spent).length;
  
  const remainingFlames = totalFlames - spentFlames;
  const remainingEmbers = totalEmbers - spentEmbers;

  const todayFlamesRemaining = today?.slots.filter(s => s.type === SlotType.Flame && s.status === SlotStatus.Free).length ?? 0;
  const todayEmbersRemaining = today?.slots.filter(s => s.type === SlotType.Ember && s.status === SlotStatus.Free).length ?? 0;

  const handleReset = () => {
    if (window.confirm('Вы уверены, что хотите завершить текущий спринт? Этот ритуал нельзя отменить.')) {
      onReset();
    }
  }

  return (
    <section className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 md:p-6 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Пламени Осталось" value={`${remainingFlames} / ${totalFlames}`} />
        <StatCard title="Углей Осталось" value={`${remainingEmbers} / ${totalEmbers}`} />
        
        {today ? (
          <>
            <StatCard title="Пламя на Сегодня" value={`${todayFlamesRemaining} / 8`} />
            <StatCard title="Угли на Сегодня" value={`${todayEmbersRemaining} / 4`} />
          </>
        ) : (
           <div className="col-span-2 bg-zinc-900 p-4 rounded-lg border border-zinc-800 text-center flex items-center justify-center">
             <p className="text-zinc-500">Сегодня день отдыха или ритуалов.</p>
           </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <button onClick={handleReset} className="text-xs text-zinc-600 hover:text-red-500 transition-colors">Завершить ритуал</button>
      </div>
    </section>
  );
};

export default Dashboard;
