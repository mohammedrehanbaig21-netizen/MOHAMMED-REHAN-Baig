
import React, { useState, useEffect, useCallback } from 'react';
import { Pill, LayoutDashboard, History, Settings, BellRing, Trash2, Calendar, Clock } from 'lucide-react';
import { Medication, AlarmState } from './types';
import MedicationForm from './components/MedicationForm';
import AlarmOverlay from './components/AlarmOverlay';
import { playVoiceReminder } from './services/geminiService';

const App: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('pillmate_meds');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [alarm, setAlarm] = useState<AlarmState>({ isActive: false });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pillmate_meds', JSON.stringify(medications));
  }, [medications]);

  // Tick timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000); // Check every 10 seconds
    return () => clearInterval(timer);
  }, []);

  // Alarm logic
  useEffect(() => {
    const currentHM = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    medications.forEach(med => {
      if (med.isActive && med.time === currentHM && !alarm.isActive) {
        // Prevent re-triggering for the same minute if just dismissed
        const lastChecked = localStorage.getItem(`last_alert_${med.id}`);
        if (lastChecked !== currentHM) {
          setAlarm({ isActive: true, medication: med });
          playVoiceReminder(med.name);
          localStorage.setItem(`last_alert_${med.id}`, currentHM);
        }
      }
    });
  }, [currentTime, medications, alarm.isActive]);

  const addMedication = (medData: Omit<Medication, 'id' | 'isActive'>) => {
    const newMed: Medication = {
      ...medData,
      id: crypto.randomUUID(),
      isActive: true
    };
    setMedications(prev => [...prev, newMed]);
  };

  const removeMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const toggleMedication = (id: string) => {
    setMedications(prev => prev.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const handleAlarmAcknowledge = () => {
    if (alarm.medication) {
      setMedications(prev => prev.map(m => 
        m.id === alarm.medication?.id ? { ...m, lastTaken: new Date().toISOString() } : m
      ));
    }
    setAlarm({ isActive: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Pill className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PillMate</h1>
          </div>
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Health Dashboard</h2>
          <p className="text-slate-500 font-medium">You have {medications.filter(m => m.isActive).length} active reminders today.</p>
        </div>

        {/* Add Section */}
        <MedicationForm onAdd={addMedication} />

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming Doses
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Today</span>
          </div>

          {medications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="flex justify-center mb-4">
                <BellRing className="w-12 h-12 text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium">No medications scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.sort((a, b) => a.time.localeCompare(b.time)).map(med => (
                <div 
                  key={med.id}
                  className={`group bg-white p-5 rounded-3xl border transition-all hover:shadow-md ${med.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${med.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{med.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-semibold text-slate-500 flex items-center gap-1">
                            {/* Fixed missing Clock import */}
                            <Clock className="w-3 h-3" />
                            {med.time}
                          </span>
                          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                            {med.dosage}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleMedication(med.id)}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${med.isActive ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${med.isActive ? 'left-7' : 'left-1'}`} />
                      </button>
                      <button 
                        onClick={() => removeMedication(med.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-bold">Today</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors">
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold">History</span>
          </button>
        </div>
      </nav>

      {/* Alarm Overlay */}
      {alarm.isActive && alarm.medication && (
        <AlarmOverlay 
          medication={alarm.medication}
          onDismiss={() => setAlarm({ isActive: false })}
          onAcknowledge={handleAlarmAcknowledge}
        />
      )}
    </div>
  );
};

export default App;
