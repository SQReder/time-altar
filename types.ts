
export enum SlotType {
  Flame = 'flame',
  Ember = 'ember',
}

export enum SlotStatus {
  Free = 'free',
  Spent = 'spent',
}

export enum DayType {
  Planning = 'planning_day',
  Flame = 'flame_day',
  Grooming = 'grooming_day',
  Ritual = 'ritual_day',
}

export interface TimeSlot {
  id: string;
  type: SlotType;
  status: SlotStatus;
  description: string;
}

export interface SprintDay {
  date: string;
  dayIndex: number; // 1-10
  type: DayType;
  slots: TimeSlot[];
}

export interface Sprint {
  startDate: string;
  days: SprintDay[];
}
