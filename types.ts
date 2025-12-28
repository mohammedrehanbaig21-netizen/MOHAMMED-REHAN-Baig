
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // HH:mm format
  frequency: 'Daily' | 'Weekly' | 'Bi-Weekly';
  isActive: boolean;
  lastTaken?: string;
}

export interface AlarmState {
  isActive: boolean;
  medication?: Medication;
}
