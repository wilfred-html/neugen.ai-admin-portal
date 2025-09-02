import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import Modal from './Modal';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onUpdateClient: (client: Client) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, client, onUpdateClient }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setPassword(''); // Don't prefill password for security
    }
  }, [client, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const updatedClient = {
        ...client,
        name,
        email,
        password: password || client.password, // Use new password if provided, else keep old one
    };
    onUpdateClient(updatedClient);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Client: ${client.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="editClientName" className="block text-sm font-medium text-text-light-minor mb-1">
            Client Name
          </label>
          <input
            type="text"
            id="editClientName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="editClientEmail" className="block text-sm font-medium text-text-light-minor mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="editClientEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="editClientPassword" className="block text-sm font-medium text-text-light-minor mb-1">
            New Password
          </label>
          <input
            type="password"
            id="editClientPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            Update Client
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditClientModal;