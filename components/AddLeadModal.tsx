import React, { useState } from 'react';
import { Lead } from '../types';
import Modal from './Modal';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => Promise<void>;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAddLead }) => {
  const [formState, setFormState] = useState<Partial<Lead>>({
    'Full Name': '',
    'Email': '',
    'Phone': '',
    'Car Interest': '',
    'Source': 'Website',
    'Notes': ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState['Full Name'] || !formState['Email']) {
        alert("Full Name and Email are required.");
        return;
    }
    setLoading(true);
    await onAddLead({
        ...formState,
       'Created Date': new Date().toISOString(),
    } as Lead);
    setLoading(false);
    onClose();
    setFormState({ 'Full Name': '', 'Email': '', 'Phone': '', 'Car Interest': '', 'Source': 'Website', 'Notes': '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="Full Name" value={formState['Full Name']} onChange={handleInputChange} placeholder="Full Name" className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
        <input name="Email" type="email" value={formState['Email']} onChange={handleInputChange} placeholder="Email" className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
        <input name="Phone" type="tel" value={formState['Phone']} onChange={handleInputChange} placeholder="Phone Number" className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        <input name="Car Interest" value={formState['Car Interest']} onChange={handleInputChange} placeholder="Car Interest" className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        <select name="Source" value={formState['Source']} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Website">Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
        </select>
        <textarea name="Notes" value={formState['Notes']} onChange={handleInputChange} placeholder="Notes..." rows={3} className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-border-dark rounded-lg text-text-light-major hover:bg-border-dark">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-text-on-primary rounded-lg hover:bg-secondary disabled:bg-slate-400">{loading ? 'Saving...' : 'Save Lead'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLeadModal;