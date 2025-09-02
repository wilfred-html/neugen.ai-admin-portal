import React, { useState, useEffect, useCallback } from 'react';
import { Client, AirtableRecord, Lead, Appointment, FinanceCalculation } from '../types';
import { getClientData, createRecord, deleteRecord } from '../services/airtableService';

import DashboardView from './client-dashboard/DashboardView';
import LeadsView from './client-dashboard/LeadsView';
import AppointmentsView from './client-dashboard/AppointmentsView';
import FinanceView from './client-dashboard/FinanceView';
import AnalyticsView from './client-dashboard/AnalyticsView';
import SettingsView from './client-dashboard/SettingsView';
import AddAppointmentModal from '../components/AddAppointmentModal';

interface ClientDashboardProps {
  client: Client;
  activePage: string;
  onUpdateClientPassword: (clientId: string, oldPass: string, newPass: string) => Promise<void>;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ client, activePage, onUpdateClientPassword }) => {
  const [data, setData] = useState<{
    leads: AirtableRecord<Lead>[];
    appointments: AirtableRecord<Appointment>[];
    financeCalculations: AirtableRecord<FinanceCalculation>[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the centralized Appointment Modal
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentInitialData, setAppointmentInitialData] = useState<Partial<Appointment> | undefined>(undefined);
  
  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const clientData = await getClientData(client.baseId);
      setData(clientData);
    } catch (e) {
      setError('Failed to load client data.');
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [client.baseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleAddLead = async (lead: Lead) => {
    await createRecord<Lead>(client.baseId, 'Leads', lead);
    await loadData(false); // Refresh data without showing main loader
  };
  
  const handleDeleteLead = async (recordId: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
        await deleteRecord(client.baseId, 'Leads', recordId);
        await loadData(false);
    }
  };
  
  const handleAddAppointment = async (appointment: Appointment) => {
    await createRecord<Appointment>(client.baseId, 'Appointments', appointment);
    await loadData(false);
  };
  
  const handleAddAppointmentAndCloseModal = async (appointment: Appointment) => {
    await handleAddAppointment(appointment);
    setIsAppointmentModalOpen(false);
  };

  const handleDeleteAppointment = async (recordId: string) => {
      if (window.confirm("Are you sure you want to cancel this appointment?")) {
          await deleteRecord(client.baseId, 'Appointments', recordId);
          await loadData(false);
      }
  };

   const handleAddFinanceCalculation = async (calculation: FinanceCalculation) => {
    await createRecord<FinanceCalculation>(client.baseId, 'Finance Calculator', calculation);
    await loadData(false);
  };
  
  const handleDeleteFinanceCalculation = async (recordId: string) => {
    if (window.confirm("Are you sure you want to delete this calculation?")) {
        await deleteRecord(client.baseId, 'Finance Calculator', recordId);
        await loadData(false);
    }
  };

  // Handler to open modal for booking from a lead
  const handleBookAppointmentFromLead = (lead: Lead) => {
    setAppointmentInitialData({
      'Full Name': lead['Full Name'],
      'Email': lead['Email'],
      'Phone': lead['Phone'],
      'Vehicle': lead['Car Interest'],
    });
    setIsAppointmentModalOpen(true);
  };

  // Handler to open a blank appointment modal
  const handleOpenNewAppointmentModal = () => {
    setAppointmentInitialData(undefined); // Clear any previous data
    setIsAppointmentModalOpen(true);
  };

  const renderContent = () => {
      if (activePage !== 'settings' && !data) return null;

      switch(activePage) {
          case 'dashboard':
              return <DashboardView data={data!} />;
          case 'leads':
              return <LeadsView leads={data!.leads} appointments={data!.appointments} onAddLead={handleAddLead} onDeleteLead={handleDeleteLead} onBookAppointment={handleBookAppointmentFromLead} />;
          case 'appointments':
              return <AppointmentsView appointments={data!.appointments} onAddAppointment={handleOpenNewAppointmentModal} onDeleteAppointment={handleDeleteAppointment} />;
          case 'finance':
              return <FinanceView calculations={data!.financeCalculations} onAddCalculation={handleAddFinanceCalculation} onDeleteCalculation={handleDeleteFinanceCalculation} />;
          case 'analytics':
              return <AnalyticsView data={data!} />;
          case 'settings':
              return <SettingsView client={client} onUpdatePassword={onUpdateClientPassword} />;
          default:
              return <DashboardView data={data!} />;
      }
  }

  if (loading && activePage !== 'settings') {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-text-light-minor">Loading {client.name}'s dashboard...</span>
      </div>
    );
  }

  if (error && activePage !== 'settings') {
    return <div className="p-8 text-center text-red-400 bg-red-500/10 rounded-lg m-8">{error}</div>;
  }
  
  if (activePage !== 'settings' && (!data || (data.leads.length === 0 && data.appointments.length === 0 && data.financeCalculations.length === 0))) {
     return <div className="p-8 text-center text-text-light-minor bg-card-dark rounded-lg m-8">No data available for this client. The provided Base ID might be incorrect or the tables might be empty.</div>;
  }


  return (
    <div className="p-8">
      <AddAppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onAddAppointment={handleAddAppointmentAndCloseModal}
        initialData={appointmentInitialData}
      />
      {renderContent()}
    </div>
  );
};

export default ClientDashboard;