import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import Modal from './Modal';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => Promise<void>;
  initialData?: Partial<Appointment>;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, onAddAppointment, initialData = {} }) => {
  const defaultState: Partial<Appointment> = { 'Full Name': '', 'Email': '', 'Phone': '', 'Vehicle': '', 'Date & Time': '', 'Channel': 'Website' };
  
  const [formState, setFormState] = useState<Partial<Appointment>>(defaultState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setFormState({
            ...defaultState,
            ...initialData,
            'Date & Time': initialData['Date & Time'] || '',
        });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState['Full Name'] || !formState['Date & Time']) {
      alert("Full Name and Date & Time are required.");
      return;
    }
    setLoading(true);
    await onAddAppointment({
        ...formState,
        'Created': new Date().toISOString(),
    } as Appointment);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book New Appointment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="Full Name" value={formState['Full Name']} onChange={handleInputChange} placeholder="Full Name" className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
        <input name="Email" type="email" value={formState['Email']} onChange={handleInputChange} placeholder="Email" className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        <input name="Phone" type="tel" value={formState['Phone']} onChange={handleInputChange} placeholder="Phone Number" className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        <input name="Vehicle" value={formState['Vehicle']} onChange={handleInputChange} placeholder="Vehicle of Interest" className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        <input name="Date & Time" type="datetime-local" value={formState['Date & Time']} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]" required />
        <select name="Channel" value={formState['Channel']} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Website">Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
        </select>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-border-dark rounded-lg text-text-light-major hover:bg-border-dark">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-text-on-primary rounded-lg hover:bg-secondary disabled:bg-slate-400">{loading ? 'Saving...' : 'Book Appointment'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAppointmentModal;