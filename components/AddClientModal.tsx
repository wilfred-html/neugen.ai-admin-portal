import React, { useState } from 'react';
import { Client } from '../types';
import Modal from './Modal';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Omit<Client, 'id'>) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAddClient }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [baseId, setBaseId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && baseId && password) {
      onAddClient({ name, email, baseId, password });
      setName('');
      setEmail('');
      setBaseId('');
      setPassword('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-text-light-minor mb-1">
            Client Name
          </label>
          <input
            type="text"
            id="clientName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-text-light-minor mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="clientEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="baseId" className="block text-sm font-medium text-text-light-minor mb-1">
            Airtable Base ID
          </label>
          <input
            type="text"
            id="baseId"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
            className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="clientPassword" className="block text-sm font-medium text-text-light-minor mb-1">
            Password
          </label>
          <input
            type="password"
            id="clientPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border-dark rounded-lg text-text-light-major hover:bg-border-dark"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-text-on-primary rounded-lg hover:bg-secondary"
          >
            Add Client
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;