
import React, { useState, useEffect } from 'react';
import { TimeSlot, SlotStatus } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slotId: string, description: string) => void;
  onFree: (slotId: string) => void;
  slot: TimeSlot;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, onFree, slot }) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (slot) {
      setDescription(slot.description || '');
    }
  }, [slot]);

  if (!isOpen || !slot) return null;

  const handleSave = () => {
    onSave(slot.id, description);
  };
  
  const handleFree = () => {
    onFree(slot.id);
  }

  const isSpent = slot.status === SlotStatus.Spent;
  const title = isSpent ? 'Изменить Запись' : `Сжечь ${slot.type === 'flame' ? 'Пламя' : 'Уголь'}`;
  const icon = slot.type === 'flame' ? '🔥' : '🌑';

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-zinc-500 hover:text-white">&times;</button>
        <h3 className="text-2xl font-bold text-center mb-4 text-amber-400">{icon} {title}</h3>
        <p className="text-zinc-400 text-center mb-6">Опишите, на что была потрачена эта частица времени. Это поможет в ретроспективе.</p>
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Например: 'Глубокая работа над компонентом X' или 'Синхронизация с командой Y'..."
          className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
        />
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {isSpent && (
            <button onClick={handleFree} className="w-full sm:w-auto flex-1 bg-zinc-700 text-zinc-200 font-bold py-3 px-6 rounded-lg hover:bg-zinc-600 transition-colors">
              Освободить
            </button>
          )}
          <button onClick={handleSave} className="w-full sm:w-auto flex-1 bg-amber-600 text-zinc-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-500 transition-colors">
            {isSpent ? 'Сохранить Изменения' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
