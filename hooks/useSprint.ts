
import { useState, useEffect, useCallback } from 'react';
import { Sprint, SprintDay, DayType, SlotType, TimeSlot, SlotStatus } from '../types';

const LOCAL_STORAGE_KEY = 'altar-of-time-sprint';

const FLAME_SLOTS_PER_DAY = 8;
const EMBER_SLOTS_PER_DAY = 4;

const generateId = () => `slot_${Math.random().toString(36).substr(2, 9)}`;

const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const useSprint = () => {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const storedSprint = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSprint) {
      setSprint(JSON.parse(storedSprint));
    }
    // Update current date every minute to check if day has changed
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sprint) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sprint));
    }
  }, [sprint]);

  const createSprint = useCallback((startDate: Date) => {
    const days: SprintDay[] = [];
    let currentDate = new Date(startDate);

    for (let i = 1; i <= 10; i++) {
      // Skip weekends (Saturday: 6, Sunday: 0)
      while (currentDate.getDay() === 6 || currentDate.getDay() === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const dayIndex = i;
      let dayType: DayType;
      
      switch (dayIndex) {
        case 1:
          dayType = DayType.Planning;
          break;
        case 9:
          dayType = DayType.Grooming;
          break;
        case 10:
          dayType = DayType.Ritual;
          break;
        default:
          dayType = DayType.Flame;
          break;
      }
      
      const slots: TimeSlot[] = [];
      for (let f = 0; f < FLAME_SLOTS_PER_DAY; f++) {
        slots.push({ id: generateId(), type: SlotType.Flame, status: SlotStatus.Free, description: '' });
      }
      for (let e = 0; e < EMBER_SLOTS_PER_DAY; e++) {
        slots.push({ id: generateId(), type: SlotType.Ember, status: SlotStatus.Free, description: '' });
      }

      days.push({
        date: currentDate.toISOString(),
        dayIndex,
        type: dayType,
        slots,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const newSprint: Sprint = { startDate: startDate.toISOString(), days };
    setSprint(newSprint);
  }, []);

  const updateSlot = useCallback((dayIndex: number, slotId: string, status: SlotStatus, description: string) => {
    setSprint(currentSprint => {
      if (!currentSprint) return null;
      const newDays = currentSprint.days.map(day => {
        if (day.dayIndex === dayIndex) {
          return {
            ...day,
            slots: day.slots.map(slot => 
              slot.id === slotId ? { ...slot, status, description } : slot
            )
          };
        }
        return day;
      });
      return { ...currentSprint, days: newDays };
    });
  }, []);
  
  const resetSprint = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSprint(null);
  }, []);

  const findToday = (s: Sprint | null): SprintDay | undefined => {
    return s?.days.find(day => isSameDay(new Date(day.date), currentDate));
  };
  
  const findDayBySlotId = (s: Sprint | null, slotId: string): SprintDay | undefined => {
      if (!s) return undefined;
      return s.days.find(d => d.slots.some(sl => sl.id === slotId));
  }
  
  const findSlotById = (s: Sprint | null, slotId: string): TimeSlot | undefined => {
      if (!s) return undefined;
      const day = findDayBySlotId(s, slotId);
      return day?.slots.find(sl => sl.id === slotId);
  }

  return { sprint, createSprint, updateSlot, resetSprint, currentDate, findToday, findSlotById };
};
