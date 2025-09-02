import React, { useState, useMemo } from 'react';
import { AirtableRecord, Lead, Appointment } from '../../types';
import KpiCard from '../../components/KpiCard';
import { DocumentTextIcon, CheckCircleIcon, ClockIcon, CalendarDaysIcon, PlusIcon, TrashIcon, BookOpenIcon } from '../../components/icons/Icons';
import AddLeadModal from '../../components/AddLeadModal';

interface LeadsViewProps {
    leads: AirtableRecord<Lead>[];
    appointments: AirtableRecord<Appointment>[];
    onAddLead: (lead: Lead) => Promise<void>;
    onDeleteLead: (recordId: string) => Promise<void>;
    onBookAppointment: (lead: Lead) => void;
}

const getSourceBadgeColor = (source?: string) => {
    const colors: { [key: string]: string } = {
        Website: "bg-blue-400/10 text-blue-300",
        WhatsApp: "bg-green-400/10 text-green-300",
        Instagram: "bg-purple-400/10 text-purple-300",
        Facebook: "bg-cyan-400/10 text-cyan-300",
    };
    return colors[source || ''] || "bg-gray-400/10 text-gray-300";
};

const LeadsView: React.FC<LeadsViewProps> = ({ leads, appointments, onAddLead, onDeleteLead, onBookAppointment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');

    const appointmentEmails = useMemo(() => new Set(appointments.map(a => a.fields['Email'])), [appointments]);

    const convertedCount = useMemo(() => {
        const leadEmailsWithData = leads.map(l => l.fields['Email']).filter(Boolean);
        const uniqueLeadEmails = new Set(leadEmailsWithData);
        return [...uniqueLeadEmails].filter(email => appointmentEmails.has(email)).length;
    }, [leads, appointmentEmails]);

    const pendingCount = leads.length - convertedCount;

    const thisMonthCount = useMemo(() => {
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        return leads.filter(record => {
            const createdDate = new Date(record.fields['Created Date'] || record.createdTime);
            return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
        }).length;
    }, [leads]);
    
    const filteredLeads = useMemo(() => {
        return leads.filter(record => {
            const fields = record.fields;
            const search = searchTerm.toLowerCase();
            const matchesSearch = !search ||
                (fields['Full Name'] || "").toLowerCase().includes(search) ||
                (fields['Email'] || "").toLowerCase().includes(search) ||
                (fields['Phone'] || "").toLowerCase().includes(search) ||
                (fields['Car Interest'] || "").toLowerCase().includes(search);
            
            const matchesSource = !sourceFilter || fields['Source'] === sourceFilter;

            return matchesSearch && matchesSource;
        }).sort((a,b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
    }, [leads, searchTerm, sourceFilter]);

    return (
        <>
            <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddLead={onAddLead} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Total Leads" value={leads.length.toString()} icon={<DocumentTextIcon className="w-6 h-6 text-text-light-minor"/>} iconBgColor="bg-border-dark"/>
                <KpiCard title="Converted Leads" value={convertedCount.toString()} icon={<CheckCircleIcon className="w-6 h-6 text-green-400"/>} iconBgColor="bg-green-500/20"/>
                <KpiCard title="Pending Follow-up" value={pendingCount.toString()} icon={<ClockIcon className="w-6 h-6 text-orange-400"/>} iconBgColor="bg-orange-500/20"/>
                <KpiCard title="This Month" value={thisMonthCount.toString()} icon={<CalendarDaysIcon className="w-6 h-6 text-primary"/>} iconBgColor="bg-primary/20"/>
            </div>

            <div className="bg-card-dark rounded-xl border border-border-dark shadow-sm">
                <div className="p-6 border-b border-border-dark flex flex-wrap justify-between items-center gap-4">
                    <h3 className="text-lg font-semibold text-text-light-major">All Leads</h3>
                    <div className="flex items-center space-x-2">
                        <input type="text" placeholder="Search leads..." className="px-3 py-2 bg-bg-dark border border-border-dark rounded-lg text-sm w-48 focus:ring-primary focus:border-primary" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <select className="px-3 py-2 bg-bg-dark border border-border-dark rounded-lg text-sm focus:ring-primary focus:border-primary" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
                            <option value="">All Sources</option>
                            <option value="Website">Website</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                        </select>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary text-text-on-primary px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
                            <PlusIcon className="w-5 h-5 mr-1" />
                            Add Lead
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-brand-dark">
                            <tr>
                                {['Lead ID', 'Name', 'Contact', 'Car Interest', 'Source', 'Date', 'Status', 'Actions'].map(h => 
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-text-light-minor uppercase tracking-wider">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody className="bg-card-dark divide-y divide-border-dark">
                            {filteredLeads.map(record => {
                                const isConverted = record.fields['Email'] ? appointmentEmails.has(record.fields['Email']) : false;
                                return (
                                <tr key={record.id} className="hover:bg-bg-dark">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-text-light-major">#{record.fields['Lead ID'] || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light-major">{record.fields['Full Name']}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light-minor">
                                        <div>{record.fields['Email']}</div>
                                        <div>{record.fields['Phone']}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light-minor">{record.fields['Car Interest']}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceBadgeColor(record.fields['Source'])}`}>
                                            {record.fields['Source'] || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light-minor">{new Date(record.fields['Created Date'] || record.createdTime).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isConverted ? "bg-green-400/10 text-green-300" : "bg-yellow-400/10 text-yellow-300"}`}>
                                            {isConverted ? "Converted" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                                         <button onClick={() => onBookAppointment(record.fields)} className="p-2 text-text-light-minor hover:text-primary hover:bg-primary/10 rounded-full" title="Book Appointment">
                                            <BookOpenIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onDeleteLead(record.id)} className="p-2 text-text-light-minor hover:text-red-400 hover:bg-red-400/10 rounded-full" title="Delete Lead">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default LeadsView;