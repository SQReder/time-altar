
import React, { useState, useCallback } from 'react';
import { useSprint } from './hooks/useSprint';
import SprintSetup from './components/SprintSetup';
import Dashboard from './components/Dashboard';
import Altar from './components/Altar';
import Modal from './components/Modal';
import { TimeSlot, SlotStatus } from './types';

export default function App() {
  const { sprint, createSprint, updateSlot, resetSprint, currentDate, findToday, findSlotById } = useSprint();
  const [modalState, setModalState] = useState<{ isOpen: boolean; slotId: string | null }>({
    isOpen: false,
    slotId: null,
  });

  const handleSlotClick = useCallback((slot: TimeSlot) => {
    if (!sprint) return;

    const dayOfSlot = sprint.days.find(d => d.slots.some(s => s.id === slot.id));
    if (!dayOfSlot) return;
    
    const dayDate = new Date(dayOfSlot.date);
    const today = new Date(currentDate);
    
    // Allow opening modal only for today or past days
    if (dayDate.setHours(0,0,0,0) <= today.setHours(0,0,0,0)) {
        setModalState({ isOpen: true, slotId: slot.id });
    }
  }, [sprint, currentDate]);

  const handleCloseModal = useCallback(() => {
    setModalState({ isOpen: false, slotId: null });
  }, []);

  const handleSaveSlot = useCallback((slotId: string, description: string) => {
    const day = sprint?.days.find(d => d.slots.some(s => s.id === slotId));
    if(day){
      updateSlot(day.dayIndex, slotId, SlotStatus.Spent, description);
    }
    handleCloseModal();
  }, [sprint, updateSlot, handleCloseModal]);

  const handleFreeSlot = useCallback((slotId: string) => {
    const day = sprint?.days.find(d => d.slots.some(s => s.id === slotId));
     if(day){
      updateSlot(day.dayIndex, slotId, SlotStatus.Free, '');
    }
    handleCloseModal();
  }, [sprint, updateSlot, handleCloseModal]);

  const activeSlot = modalState.slotId ? findSlotById(sprint, modalState.slotId) : undefined;
  const today = findToday(sprint);

  if (!sprint) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <SprintSetup onCreate={createSprint} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-400">Алтарь Времени</h1>
        <p className="text-center text-zinc-500 mt-1">Осознанно управляй своей энергией</p>
      </header>
      
      <main className="flex-grow flex flex-col space-y-6">
        <Dashboard sprint={sprint} today={today} onReset={resetSprint} />
        <Altar sprint={sprint} currentDate={currentDate} onSlotClick={handleSlotClick} today={today} />
      </main>

      {modalState.isOpen && activeSlot && (
        <Modal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          onSave={handleSaveSlot}
          onFree={handleFreeSlot}
          slot={activeSlot}
        />
      )}
      <footer className="text-center text-xs text-zinc-600">
        <p>Время необратимо. Сжигай его с умом.</p>
      </footer>
    </div>
  );
}
