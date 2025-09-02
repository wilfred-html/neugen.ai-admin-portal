import React, { useState, useCallback } from 'react';
import { Client } from './types';
import AdminPortal from './pages/AdminPortal';
import ClientDashboard from './pages/ClientDashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';

type User = { type: 'admin', name: string } | { type: 'client', client: Client };

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Auto Pedigree', email: 'contact@autopedigree.com', baseId: 'appDofhFjFXPbGpeu', password: 'pass123' },
    { id: '2', name: 'Future Motors', email: 'sales@futuremotors.co', baseId: 'appXXXXXXXXXXXXXX', password: 'pass123' },
    { id: '3', name: 'Classic Cars Inc.', email: 'info@classiccars.com', baseId: 'appYYYYYYYYYYYYYY', password: 'pass123' },
  ]);
  const [user, setUser] = useState<User | null>(null);
  const [viewingClientAsAdmin, setViewingClientAsAdmin] = useState<Client | null>(null);
  const [activeClientPage, setActiveClientPage] = useState('dashboard');


  const handleLogin = useCallback(async (email: string, pass: string) => {
    const lowerEmail = email.toLowerCase();
    
    if (lowerEmail === 'admin@neugenai.io' && pass === 'admin123') {
        setUser({ type: 'admin', name: 'Admin' });
        return;
    }
    
    const clientUser = clients.find(c => c.email.toLowerCase() === lowerEmail);

    if (clientUser && clientUser.password === pass) {
        setUser({ type: 'client', client: clientUser });
        setActiveClientPage('dashboard');
    } else {
        throw new Error('Invalid credentials. Please check your email and password.');
    }
  }, [clients]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setViewingClientAsAdmin(null);
  }, []);

  const handleViewClientDashboard = useCallback((client: Client) => {
    if (user?.type === 'admin') {
        setViewingClientAsAdmin(client);
        setActiveClientPage('dashboard');
    }
  }, [user]);

  const handleBackToAdmin = useCallback(() => {
    setViewingClientAsAdmin(null);
  }, []);
  
  const handleAddClient = useCallback((newClient: Omit<Client, 'id'>) => {
    setClients(prevClients => [
      ...prevClients,
      { ...newClient, id: (prevClients.length + 2).toString() },
    ]);
  }, []);

  const handleUpdateClient = useCallback((updatedClient: Client) => {
    setClients(prevClients => 
        prevClients.map(client => client.id === updatedClient.id ? updatedClient : client)
    );
    // If the admin is currently viewing the client that was updated, refresh the view.
    if(viewingClientAsAdmin?.id === updatedClient.id) {
        setViewingClientAsAdmin(updatedClient);
    }
  }, [viewingClientAsAdmin]);

  const handleChangeClientPassword = useCallback(async (clientId: string, oldPass: string, newPass: string): Promise<void> => {
      const clientToUpdate = clients.find(c => c.id === clientId);

      if (!clientToUpdate || clientToUpdate.password !== oldPass) {
          throw new Error("The current password you entered is incorrect.");
      }
      
      const updatedClients = clients.map(c => 
          c.id === clientId ? { ...c, password: newPass } : c
      );
      setClients(updatedClients);
  }, [clients]);
  
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isViewingClient = user.type === 'admin' && viewingClientAsAdmin;
  const currentClient = isViewingClient ? viewingClientAsAdmin : (user.type === 'client' ? user.client : null);
  const userName = user.type === 'admin' ? user.name : user.client.name;

  return (
    <div className="flex h-screen bg-bg-dark">
      <Sidebar 
        userType={user.type}
        selectedClient={currentClient} 
        onBackToAdmin={handleBackToAdmin}
        activePage={activeClientPage}
        onNavigate={setActiveClientPage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            clientName={currentClient?.name} 
            userName={userName}
            onLogout={handleLogout}
            pageTitle={activeClientPage}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-dark">
          {currentClient ? (
            <ClientDashboard 
                client={currentClient} 
                activePage={activeClientPage}
                onUpdateClientPassword={handleChangeClientPassword}
            />
          ) : (
            <AdminPortal
              clients={clients}
              onSelectClient={handleViewClientDashboard}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;