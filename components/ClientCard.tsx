import React from 'react';
import { Client } from '../types';
import { ChevronRightIcon } from './icons/Icons';

interface ClientCardProps {
  client: Client;
  onSelectClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onSelectClient, onEditClient }) => {
  return (
    <div className="bg-card-dark rounded-xl border border-border-dark shadow-sm p-6 flex items-center justify-between transition-all hover:shadow-lg hover:border-primary">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-text-on-primary font-bold text-xl">
          {client.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-light-major">{client.name}</h3>
          <p className="text-sm text-text-light-minor">{client.email}</p>
          <p className="text-xs text-text-light-minor/50 mt-1">Base ID: {client.baseId}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
         <button
            onClick={() => onEditClient(client)}
            className="px-4 py-2 bg-border-dark text-text-light-major rounded-lg text-sm font-medium hover:bg-border-dark/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span>Edit</span>
          </button>
        <button
          onClick={() => onSelectClient(client)}
          className="flex items-center px-4 py-2 bg-primary text-text-on-primary rounded-lg text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark focus:ring-primary disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <span>View Dashboard</span>
          <ChevronRightIcon className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ClientCard;