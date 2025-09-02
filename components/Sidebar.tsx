import React from 'react';
import { Client } from '../types';
import { HomeIcon, UserGroupIcon, ArrowLeftIcon, ChartBarIcon, CalendarIcon, CurrencyDollarIcon, PresentationChartLineIcon, Cog6ToothIcon } from './icons/Icons';
import App from '../App';

interface SidebarProps {
  userType: 'admin' | 'client';
  selectedClient: Client | null;
  onBackToAdmin: () => void;
  onNavigate?: (page: string) => void;
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, selectedClient, onBackToAdmin, onNavigate, activePage = 'dashboard' }) => {
  const canGoBack = userType === 'admin' && selectedClient;

  const handleNavigation = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if(onNavigate) {
      onNavigate(page)
    }
  }

  const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    pageName: string;
  }> = ({ icon, label, pageName }) => {
    const isActive = activePage === pageName;
    return (
      <a
        href="#"
        onClick={(e) => handleNavigation(e, pageName)}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-primary/20 text-primary'
            : 'text-text-light-minor hover:bg-card-dark hover:text-text-light-major'
        }`}
      >
        {icon}
        {label}
      </a>
    );
  };

  return (
    <div className="flex flex-col w-64 bg-brand-dark border-r border-border-dark p-4 space-y-4">
      <div className="flex items-center space-x-3 h-16 px-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-text-on-primary font-bold text-lg">
          N
        </div>
        <span className="font-semibold text-xl text-text-light-major">NeuGen.AI</span>
      </div>

      <nav className="flex-1 space-y-2">
        {canGoBack && (
          <button
            onClick={onBackToAdmin}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-text-light-minor hover:bg-card-dark hover:text-text-light-major rounded-lg"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-3" />
            Back to Admin
          </button>
        )}

        {selectedClient ? (
          <div className={`space-y-2 ${canGoBack ? 'pt-4 mt-4 border-t border-border-dark' : ''}`}>
               <p className="px-4 text-xs font-semibold text-text-light-minor uppercase">CLIENT VIEW</p>
               <p className="px-4 font-bold text-primary">{selectedClient.name}</p>
               <NavLink icon={<HomeIcon className="w-5 h-5 mr-3" />} label="Dashboard" pageName="dashboard" />
               <NavLink icon={<UserGroupIcon className="w-5 h-5 mr-3" />} label="Leads" pageName="leads" />
               <NavLink icon={<CalendarIcon className="w-5 h-5 mr-3" />} label="Appointments" pageName="appointments" />
               <NavLink icon={<CurrencyDollarIcon className="w-5 h-5 mr-3" />} label="Finance" pageName="finance" />
               <NavLink icon={<PresentationChartLineIcon className="w-5 h-5 mr-3" />} label="Analytics" pageName="analytics" />
               <NavLink icon={<Cog6ToothIcon className="w-5 h-5 mr-3" />} label="Settings" pageName="settings" />
          </div>
        ) : (
           <>
            <p className="px-4 text-xs font-semibold text-text-light-minor uppercase">ADMIN VIEW</p>
             <a href="#" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary/20 text-primary">
                <ChartBarIcon className="w-5 h-5 mr-3"/>
                Clients Overview
             </a>
           </>
        )}
      </nav>

      <div className="p-4 bg-card-dark rounded-lg">
        <h4 className="font-semibold text-text-light-major">Need Help?</h4>
        <p className="text-sm text-text-light-minor">Contact our support team.</p>
      </div>
    </div>
  );
};

export default Sidebar;