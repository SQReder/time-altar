
import React from 'react';
import { TimeSlot, SlotType, SlotStatus } from '../types';

interface TimeSlotProps {
  slot: TimeSlot;
  isInteractive: boolean;
  onClick: () => void;
}

const TimeSlotComponent: React.FC<TimeSlotProps> = ({ slot, isInteractive, onClick }) => {
  const isSpent = slot.status === SlotStatus.Spent;
  const isFlame = slot.type === SlotType.Flame;

  const baseClasses = "w-full aspect-square rounded-full flex items-center justify-center transition-all duration-300 relative group";
  
  const stateClasses = isSpent 
    ? (isFlame ? 'bg-orange-500/80 shadow-md shadow-orange-900/60' : 'bg-slate-600/80 shadow-md shadow-slate-900/60') 
    : 'bg-zinc-800 border-2 border-dashed border-zinc-600';

  const interactiveClasses = isInteractive 
    ? 'cursor-pointer hover:bg-zinc-700 hover:border-solid' 
    : 'cursor-not-allowed opacity-70';

  return (
    <div 
      className={`${baseClasses} ${stateClasses} ${interactiveClasses}`}
      onClick={isInteractive ? onClick : undefined}
      title={isInteractive ? (isSpent ? 'Изменить' : 'Сжечь') : ''}
    >
      <div className={`text-2xl transition-transform duration-200 ${isSpent ? 'scale-110' : 'scale-90 group-hover:scale-100'}`}>
        {isFlame ? '🔥' : '🌑'}
      </div>
      {isSpent && slot.description && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-zinc-900" title={slot.description}></div>
      )}
    </div>
  );
};

export default TimeSlotComponent;
