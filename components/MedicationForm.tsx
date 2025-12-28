
import React, { useState } from 'react';
import { PlusCircle, Clock, Pill, Trash2 } from 'lucide-react';
import { Medication } from '../types';

interface MedicationFormProps {
  onAdd: (med: Omit<Medication, 'id' | 'isActive'>) => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState<Medication['frequency']>('Daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage || !time) return;
    onAdd({ name, dosage, time, frequency });
    setName('');
    setDosage('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2 text-blue-600">
        <Pill className="w-5 h-5" />
        <h3 className="font-bold">Add New Medication</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">Medicine Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Vitamin C"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">Dosage</label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g., 500mg, 1 tablet"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">Reminder Time</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-1">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Bi-Weekly</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
      >
        <PlusCircle className="w-5 h-5" />
        Schedule Reminder
      </button>
    </form>
  );
};

export default MedicationForm;
