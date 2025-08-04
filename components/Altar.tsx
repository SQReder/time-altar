
import React from 'react';
import { Sprint, TimeSlot, SprintDay } from '../types';
import DayColumn from './DayColumn';

interface AltarProps {
  sprint: Sprint;
  currentDate: Date;
  onSlotClick: (slot: TimeSlot) => void;
  today: SprintDay | undefined;
}

const isPast = (dayDate: Date, currentDate: Date): boolean => {
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(dayDate);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() < today.getTime();
}

const Altar: React.FC<AltarProps> = ({ sprint, currentDate, onSlotClick, today }) => {
  // The first day of the sprint determines the grid offset.
  // getDay() returns 1 for Monday, 2 for Tuesday, ..., 5 for Friday.
  const firstDayDate = new Date(sprint.days[0].date);
  const startDayOfWeek = firstDayDate.getDay(); 

  // Calculate the number of empty placeholder cells needed before the first day.
  // If Monday, startDayOfWeek is 1, so offset is 0.
  // If Friday, startDayOfWeek is 5, so offset is 4.
  const startOffset = startDayOfWeek > 0 ? startDayOfWeek - 1 : 0; // handle Monday=1 case safely

  const placeholders = Array.from({ length: startOffset }).map((_, index) => (
    <div key={`placeholder-${index}`} className="hidden md:block rounded-lg bg-zinc-950/30 border-2 border-dashed border-zinc-800 min-h-[20rem]"></div>
  ));

  return (
    <div className="flex-grow bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {placeholders}
        {sprint.days.map((day) => {
          const dayDate = new Date(day.date);
          const isCurrentDay = !!today && today.dayIndex === day.dayIndex;
          const isPastDay = isPast(dayDate, currentDate);

          return (
            <DayColumn
              key={day.dayIndex}
              day={day}
              isCurrent={isCurrentDay}
              isPast={isPastDay && !isCurrentDay}
              onSlotClick={onSlotClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Altar;
