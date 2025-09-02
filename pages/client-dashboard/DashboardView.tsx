import React, { useMemo } from 'react';
import { AirtableRecord, Lead, Appointment, FinanceCalculation } from '../../types';
import KpiCard from '../../components/KpiCard';
import { CurrencyDollarIcon, PresentationChartLineIcon, UserGroupIcon, CalendarIcon } from '../../components/icons/Icons';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardViewProps {
    data: {
        leads: AirtableRecord<Lead>[];
        appointments: AirtableRecord<Appointment>[];
        financeCalculations: AirtableRecord<FinanceCalculation>[];
    };
}

const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `R${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `R${(amount / 1000).toFixed(0)}K`;
    return `R${amount.toLocaleString()}`;
};

const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {

    const { leads, appointments, financeCalculations } = data;

    const totalIncome = useMemo(() => financeCalculations.reduce((sum, record) => sum + (record.fields['Total Cost'] || 0), 0), [financeCalculations]);
    const totalLeads = leads.length;
    const totalBookings = appointments.length;
    const conversionRate = totalLeads > 0 ? ((totalBookings / totalLeads) * 100).toFixed(1) : '0';

    const inquiryData = useMemo(() => {
        return leads.reduce((acc, record) => {
            const source = record.fields['Source'] || 'Unknown';
            const existing = acc.find(item => item.name === source);
            if (existing) {
                existing.value += 1;
            } else {
                acc.push({ name: source, value: 1 });
            }
            return acc;
        }, [] as { name: string; value: number }[]);
    }, [leads]);
    
    const channelData = useMemo(() => {
        return appointments.reduce((acc, record) => {
            const channel = record.fields['Channel'] || 'Unknown';
            const existing = acc.find(item => item.name === channel);
            if (existing) {
                existing.value += 1;
            } else {
                acc.push({ name: channel, value: 1 });
            }
            return acc;
        }, [] as { name: string; value: number }[]);
    }, [appointments]);


    const upcomingAppointments = useMemo(() => {
        return appointments
            .filter(record => new Date(record.fields['Date & Time'] || 0) > new Date())
            .sort((a, b) => new Date(a.fields['Date & Time'] || 0).getTime() - new Date(b.fields['Date & Time'] || 0).getTime())
            .slice(0, 5);
    }, [appointments]);

    const COLORS = ['#00f0fe', '#38bdf8', '#818cf8', '#facc15', '#4ade80'];
    const textLightMinor = '#a0a0a0';

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="p-2 bg-card-dark border border-border-dark rounded-md shadow-lg">
              <p className="label text-text-light-major">{`${label} : ${payload[0].value}`}</p>
            </div>
          );
        }
        return null;
    };
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Total Income" value={formatCurrency(totalIncome)} change={`From ${financeCalculations.length} calculations`} icon={<CurrencyDollarIcon className="w-6 h-6 text-green-400" />} iconBgColor="bg-green-500/20" />
                <KpiCard title="Conversion Rate" value={`${conversionRate}%`} change={`${totalBookings}/${totalLeads} conversions`} icon={<PresentationChartLineIcon className="w-6 h-6 text-primary" />} iconBgColor="bg-primary/20" />
                <KpiCard title="New Leads" value={totalLeads.toString()} icon={<UserGroupIcon className="w-6 h-6 text-purple-400" />} iconBgColor="bg-purple-500/20" />
                <KpiCard title="Confirmed Bookings" value={totalBookings.toString()} icon={<CalendarIcon className="w-6 h-6 text-orange-400" />} iconBgColor="bg-orange-500/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-text-light-major">Inquiry Breakdown (Leads by Source)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Tooltip content={<CustomTooltip />} />
                            <Pie data={inquiryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} fill="#8884d8" paddingAngle={5}>
                                {inquiryData?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Legend wrapperStyle={{ color: textLightMinor }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-text-light-major">Top Performing Channels (Bookings)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Tooltip content={<CustomTooltip />} />
                            <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} fill="#8884d8" paddingAngle={5}>
                                {channelData?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS.slice(1)[index % (COLORS.length - 1)]} />)}
                            </Pie>
                            <Legend wrapperStyle={{ color: textLightMinor }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-text-light-major">Monthly Revenue</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={financeCalculations.map(r => ({ name: new Date(r.createdTime).toLocaleDateString(), revenue: r.fields['Total Cost'] || 0 }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke={textLightMinor} strokeOpacity={0.2}/>
                            <XAxis dataKey="name" tick={{ fill: textLightMinor }} />
                            <YAxis tickFormatter={formatCurrency} tick={{ fill: textLightMinor }} />
                            <Tooltip content={<CustomTooltip />} formatter={(value: number) => formatCurrency(value)} />
                            <Legend wrapperStyle={{ color: textLightMinor }} />
                            <Bar dataKey="revenue" fill={COLORS[4]} name="Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-text-light-major">Upcoming Appointments</h3>
                    <div className="space-y-3 overflow-y-auto h-80 pr-2">
                         {upcomingAppointments.length > 0 ? upcomingAppointments.map(record => (
                             <div key={record.id} className="bg-bg-dark rounded-lg p-3 border border-border-dark">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium text-text-light-major">{record.fields['Full Name']}</div>
                                        <div className="text-sm text-text-light-minor">{record.fields['Vehicle'] || 'Vehicle TBD'}</div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <div className="text-sm text-primary">{new Date(record.fields['Date & Time']!).toLocaleDateString()}</div>
                                        <div className="text-xs text-text-light-minor">{new Date(record.fields['Date & Time']!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                             </div>
                         )) : (
                            <div className="text-text-light-minor text-sm text-center py-4">No upcoming appointments</div>
                         )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardView;