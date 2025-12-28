
import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import { Medication } from '../types';

interface AlarmOverlayProps {
  medication: Medication;
  onDismiss: () => void;
  onAcknowledge: () => void;
}

const AlarmOverlay: React.FC<AlarmOverlayProps> = ({ medication, onDismiss, onAcknowledge }) => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    // Vibrate device if supported
    if ("vibrate" in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
    
    const interval = setInterval(() => setPulse(p => !p), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-500 ${pulse ? 'bg-red-600' : 'bg-red-700'}`}>
      <div className="max-w-md w-full mx-4 bg-white rounded-3xl shadow-2xl p-8 text-center animate-buzz">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Bell className="w-12 h-12 text-red-600 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pill Alert!</h1>
        <p className="text-xl text-slate-600 mb-8">It's time to take your medicine</p>
        
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
          <h2 className="text-4xl font-black text-slate-900 mb-1">{medication.name}</h2>
          <p className="text-lg font-medium text-blue-600">{medication.dosage}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onDismiss}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
          >
            <XCircle className="w-5 h-5" />
            Snooze
          </button>
          <button
            onClick={onAcknowledge}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            Taken
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmOverlay;
