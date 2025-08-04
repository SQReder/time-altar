
import React from 'react';
import { SprintDay, DayType, TimeSlot, SlotType } from '../types';
import TimeSlotComponent from './TimeSlot';

interface DayColumnProps {
  day: SprintDay;
  isCurrent: boolean;
  isPast: boolean;
  onSlotClick: (slot: TimeSlot) => void;
}

const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { weekday: 'long' });
};

const specialDaysInfo: Partial<Record<DayType, { icon: string; title: string }>> = {
  [DayType.Planning]: { icon: '📅', title: 'Планирование' },
  [DayType.Grooming]: { icon: '💬', title: 'Груминг' },
  [DayType.Ritual]: { icon: '🏆', title: 'Ритуалы' },
};


const DayHeader: React.FC<{ day: SprintDay; isCurrent: boolean }> = ({ day, isCurrent }) => {
  const date = new Date(day.date);
  const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  const specialInfo = specialDaysInfo[day.type];

  return (
    <div className="text-center mb-4 pb-2 border-b-2 border-zinc-700">
      <div className="flex items-center justify-center gap-2">
        {specialInfo && <span className="text-lg" title={specialInfo.title}>{specialInfo.icon}</span>}
        <p className={`font-bold text-lg ${isCurrent ? 'text-amber-300' : 'text-zinc-300'}`}>{`День ${day.dayIndex}`}</p>
      </div>
      <p className="text-xs text-zinc-500">{getDayName(day.date)}, {formattedDate}</p>
    </div>
  );
}

const DayColumn: React.FC<DayColumnProps> = ({ day, isCurrent, isPast, onSlotClick }) => {
  const columnClasses = `
    w-full flex flex-col
    bg-zinc-900 rounded-lg p-3
    border-2
    ${isCurrent ? 'border-amber-400/80 shadow-lg shadow-amber-900/50' : 'border-zinc-800'}
    ${isPast ? 'opacity-60' : ''}
    transition-all duration-300
  `;

  const renderSlots = (type: SlotType) => (
    <div className="grid grid-cols-4 gap-2">
      {day.slots
        .filter(slot => slot.type === type)
        .map(slot => (
          <TimeSlotComponent
            key={slot.id}
            slot={slot}
            isInteractive={isCurrent || isPast} // Allow interaction on current and past days
            onClick={() => (isCurrent || isPast) && onSlotClick(slot)}
          />
        ))}
    </div>
  );

  return (
    <div className={columnClasses}>
      <DayHeader day={day} isCurrent={isCurrent} />
      <div className="flex-grow overflow-y-auto pr-1">
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-sm text-center text-orange-400 mb-2">🔥 Пламя</h4>
            {renderSlots(SlotType.Flame)}
          </div>
          <div>
            <h4 className="font-bold text-sm text-center text-slate-400 mb-2">🌑 Угли</h4>
            {renderSlots(SlotType.Ember)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayColumn;
