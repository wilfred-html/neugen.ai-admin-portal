import React, { useState } from 'react';
import { Client } from '../types';
import KpiCard from '../components/KpiCard';
import ClientCard from '../components/ClientCard';
import AddClientModal from '../components/AddClientModal';
import EditClientModal from '../components/EditClientModal';
import { UserGroupIcon, DocumentTextIcon, BanknotesIcon, PlusIcon } from '../components/icons/Icons';

interface AdminPortalProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onUpdateClient: (client: Client) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ clients, onSelectClient, onAddClient, onUpdateClient }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const handleOpenEditModal = (client: Client) => {
        setEditingClient(client);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingClient(null);
    };
    
    // In a real application, these would be calculated by fetching data from all clients.
    const totalClients = clients.length;
    const totalLeads = 1258; // Mock data
    const totalRevenue = 4560750; // Mock data

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `R${(amount / 1000000).toFixed(2)}M`;
        }
        return `R${(amount / 1000).toFixed(0)}K`;
    }

  return (
    <div className="p-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard 
            title="Total Clients" 
            value={totalClients.toString()} 
            icon={<UserGroupIcon className="w-6 h-6 text-primary" />}
            iconBgColor="bg-primary/20"
        />
        <KpiCard 
            title="Total Leads (All Clients)" 
            value={totalLeads.toLocaleString()}
            icon={<DocumentTextIcon className="w-6 h-6 text-primary" />}
            iconBgColor="bg-primary/20"
        />
        <KpiCard 
            title="Total Revenue (All Clients)" 
            value={formatCurrency(totalRevenue)}
            icon={<BanknotesIcon className="w-6 h-6 text-primary" />}
            iconBgColor="bg-primary/20"
        />
      </div>

      {/* Client List */}
      <div className="bg-card-dark rounded-xl border border-border-dark shadow-sm">
        <div className="p-6 border-b border-border-dark flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-light-major">Client Management</h2>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-primary text-text-on-primary px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Client
          </button>
        </div>
        <div className="p-6 space-y-4">
          {clients.map(client => (
            <ClientCard 
                key={client.id} 
                client={client} 
                onSelectClient={onSelectClient}
                onEditClient={handleOpenEditModal} 
            />
          ))}
        </div>
      </div>
      <AddClientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddClient={onAddClient}/>
      {editingClient && (
        <EditClientModal 
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            client={editingClient}
            onUpdateClient={(updatedClient) => {
                onUpdateClient(updatedClient);
                handleCloseEditModal();
            }}
        />
      )}
    </div>
  );
};

export default AdminPortal;