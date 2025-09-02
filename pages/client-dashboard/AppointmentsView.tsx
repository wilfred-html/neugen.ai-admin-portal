import React, { useState, useMemo } from 'react';
import { AirtableRecord, Appointment } from '../../types';
import KpiCard from '../../components/KpiCard';
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon, PlusIcon, TrashIcon } from '../../components/icons/Icons';

interface AppointmentsViewProps {
    appointments: AirtableRecord<Appointment>[];
    onAddAppointment: () => void;
    onDeleteAppointment: (recordId: string) => Promise<void>;
}

const getChannelBadgeColor = (channel?: string) => {
    const colors: { [key: string]: string } = {
        Website: "bg-blue-400/10 text-blue-300",
        WhatsApp: "bg-green-400/10 text-green-300",
        Instagram: "bg-purple-400/10 text-purple-300",
        Facebook: "bg-cyan-400/10 text-cyan-300",
    };
    return colors[channel || ''] || "bg-gray-400/10 text-gray-300";
};

const AppointmentsView: React.FC<AppointmentsViewProps> = ({ appointments, onAddAppointment, onDeleteAppointment }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [channelFilter, setChannelFilter] = useState('');

    const stats = useMemo(() => {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1;
        const nextWeek = today.getTime() + 7 * 24 * 60 * 60 * 1000;
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();

        return appointments.reduce((acc, record) => {
            const appDate = new Date(record.fields['Date & Time'] || record.createdTime);
            const appTime = appDate.getTime();

            if (appTime >= todayStart && appTime <= todayEnd) acc.today++;
            if (appTime > today.getTime() && appTime <= nextWeek) acc.upcoming++;
            if (appDate.getMonth() === thisMonth && appDate.getFullYear() === thisYear) acc.thisMonth++;
            return acc;
        }, { today: 0, upcoming: 0, thisMonth: 0 });
    }, [appointments]);

    const filteredAppointments = useMemo(() => {
        return appointments.filter(record => {
            const fields = record.fields;
            const search = searchTerm.toLowerCase();
            const matchesSearch = !search ||
                (fields['Full Name'] || "").toLowerCase().includes(search) ||
                (fields['Email'] || "").toLowerCase().includes(search) ||
                (fields['Phone'] || "").toLowerCase().includes(search) ||
                (fields['Vehicle'] || "").toLowerCase().includes(search);
            
            const matchesChannel = !channelFilter || fields['Channel'] === channelFilter;

            return matchesSearch && matchesChannel;
        }).sort((a,b) => new Date(b.fields['Date & Time'] || 0).getTime() - new Date(a.fields['Date & Time'] || 0).getTime());
    }, [appointments, searchTerm, channelFilter]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Total Appointments" value={appointments.length.toString()} icon={<CalendarDaysIcon className="w-6 h-6 text-text-light-minor"/>} iconBgColor="bg-border-dark"/>
                <KpiCard title="Today's Appointments" value={stats.today.toString()} icon={<CheckCircleIcon className="w-6 h-6 text-green-400"/>} iconBgColor="bg-green-500/20"/>
                <KpiCard title="Upcoming (7 days)" value={stats.upcoming.toString()} icon={<ClockIcon className="w-6 h-6 text-orange-400"/>} iconBgColor="bg-orange-500/20"/>
                <KpiCard title="This Month" value={stats.thisMonth.toString()} icon={<CalendarDaysIcon className="w-6 h-6 text-primary"/>} iconBgColor="bg-primary/20"/>
            </div>

            <div className="bg-card-dark rounded-xl border border-border-dark shadow-sm">
                <div className="p-6 border-b border-border-dark flex flex-wrap justify-between items-center gap-4">
                    <h3 className="text-lg font-semibold text-text-light-major">All Appointments</h3>
                    <div className="flex items-center space-x-2">
                        <input type="text" placeholder="Search appointments..." className="px-3 py-2 bg-bg-dark border border-border-dark rounded-lg text-sm w-48 focus:ring-primary focus:border-primary" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <select className="px-3 py-2 bg-bg-dark border border-border-dark rounded-lg text-sm focus:ring-primary focus:border-primary" value={channelFilter} onChange={e => setChannelFilter(e.target.value)}>
                            <option value="">All Channels</option>
                            <option value="Website">Website</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                        </select>
                         <button onClick={onAddAppointment} className="flex items-center bg-primary text-text-on-primary px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
                            <PlusIcon className="w-5 h-5 mr-1" />
                            Book Appointment
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-brand-dark">
                            <tr>
                                {['Booking ID', 'Name', 'Contact', 'Vehicle', 'Date & Time', 'Channel', 'Status', 'Actions'].map(h => 
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-text-light-minor uppercase tracking-wider">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody className="bg-card-dark divide-y divide-border-dark">
                            {filteredAppointments.map(record => {
                                const appointmentDate = new Date(record.fields['Date & Time'] || 0);
                                const now = new Date();
                                let status = "Upcoming";
                                let statusColor = "bg-blue-400/10 text-blue-300";
                                if (appointmentDate < now) {
                                    status = "Completed";
                                    statusColor = "bg-green-400/10 text-green-300";
                                } else if (appointmentDate.toDateString() === now.toDateString()) {
                                    status = "Today";
                                    statusColor = "bg-orange-400/10 text-orange-300";
                                }
                                return (
                                <tr key={record.id} className="hover:bg-bg-dark">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-text-light-major">#{record.fields['Booking ID'] || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light-major">{record.fields['Full Name']}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light-minor">
                                        <div>{record.fields['Email']}</div>
                                        <div>{record.fields['Phone']}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light-minor">{record.fields['Vehicle']}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-light-minor">{appointmentDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getChannelBadgeColor(record.fields['Channel'])}`}>
                                            {record.fields['Channel'] || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button onClick={() => onDeleteAppointment(record.id)} className="p-2 text-text-light-minor hover:text-red-400 hover:bg-red-400/10 rounded-full" title="Cancel Appointment">
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

export default AppointmentsView;