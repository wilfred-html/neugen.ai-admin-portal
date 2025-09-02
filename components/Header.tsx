import React from 'react';
import { ArrowRightOnRectangleIcon } from './icons/Icons';

interface HeaderProps {
    clientName?: string;
    userName: string;
    onLogout: () => void;
    pageTitle?: string;
}

const pageTitles: { [key: string]: { title: string, desc: string } } = {
    dashboard: {
      title: "Dashboard",
      desc: "Your performance overview. Let's close more deals.",
    },
    leads: {
      title: "Lead Pipeline",
      desc: "View, manage, and convert your leads.",
    },
    appointments: {
      title: "Bookings",
      desc: "Oversee all scheduled client appointments.",
    },
    finance: {
      title: "Deal Calculator",
      desc: "Structure and save deals for your customers.",
    },
    analytics: {
      title: "Performance Analytics",
      desc: "Unlock data-driven insights to boost sales.",
    },
    settings: {
        title: "Account Settings",
        desc: "Manage your profile and security settings.",
    }
  };


const Header: React.FC<HeaderProps> = ({ clientName, userName, onLogout, pageTitle = 'dashboard' }) => {
    
    const getHeaderContent = () => {
        if (clientName) {
            const pageInfo = pageTitles[pageTitle] || pageTitles.dashboard;
            return {
                title: `${clientName} - ${pageInfo.title}`,
                desc: pageInfo.desc,
            };
        }
        return {
            title: 'Platform Command',
            desc: 'Oversee client performance and drive growth.',
        };
    };

    const { title, desc } = getHeaderContent();

    return (
        <header className="bg-card-dark border-b border-border-dark">
            <div className="px-8 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-light-major">
                        {title}
                    </h1>
                    <p className="text-text-light-minor mt-1">
                        {desc}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-text-light-minor">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-bg-dark ring-primary">
                        <span className="text-text-on-primary text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
                    </div>
                    <button onClick={onLogout} className="flex items-center text-text-light-minor hover:text-primary transition-colors" title="Logout">
                        <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;