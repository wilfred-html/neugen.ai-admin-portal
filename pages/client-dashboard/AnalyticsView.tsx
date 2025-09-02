import React, { useMemo } from 'react';
import { AirtableRecord, Lead, Appointment, FinanceCalculation } from '../../types';
import KpiCard from '../../components/KpiCard';
import { PresentationChartLineIcon, BanknotesIcon, ChartBarIcon, ClockIcon } from '../../components/icons/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnalyticsViewProps {
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

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
    const { leads, appointments, financeCalculations } = data;
    const textLightMinor = '#a0a0a0';

    const leadConversionRate = useMemo(() => {
        return leads.length > 0 ? (appointments.length / leads.length * 100) : 0;
    }, [leads, appointments]);

    const avgDealValue = useMemo(() => {
        if (financeCalculations.length === 0) return 0;
        const totalValue = financeCalculations.reduce((sum, record) => sum + (record.fields['Total Cost'] || 0), 0);
        return totalValue / financeCalculations.length;
    }, [financeCalculations]);
    
    const topChannel = useMemo(() => {
         const channelStats = appointments.reduce((acc, { fields }) => {
            const channel = fields.Channel || 'Unknown';
            acc[channel] = (acc[channel] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.keys(channelStats).reduce((a, b) => channelStats[a] > channelStats[b] ? a : b, 'N/A');
    }, [appointments]);

    const sourcesPerformance = useMemo(() => {
        const sources = ['Website', 'WhatsApp', 'Instagram', 'Facebook'];
        const appointmentEmails = new Set(appointments.map(a => a.fields.Email));
        return sources.map(source => {
            const sourceLeads = leads.filter(l => l.fields.Source === source);
            const converted = sourceLeads.filter(l => appointmentEmails.has(l.fields.Email)).length;
            const conversionRate = sourceLeads.length > 0 ? (converted / sourceLeads.length * 100) : 0;
            return { name: source, 'Conversion Rate': Math.round(conversionRate) };
        });
    }, [leads, appointments]);

    const monthlyTrend = useMemo(() => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trend = monthNames.map(name => ({ name, leads: 0, appointments: 0 }));
        
        leads.forEach(record => {
            const month = new Date(record.createdTime).getMonth();
            trend[month].leads++;
        });
        appointments.forEach(record => {
            const month = new Date(record.createdTime).getMonth();
            trend[month].appointments++;
        });

        return trend.filter(m => m.leads > 0 || m.appointments > 0);
    }, [leads, appointments]);
    
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="p-2 bg-card-dark border border-border-dark rounded-md shadow-lg">
                <p className="label text-text-light-major mb-1">{label}</p>
                {payload.map((pld: any, index: number) => (
                    <div key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</div>
                ))}
            </div>
          );
        }
        return null;
    };

    return (
        <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Lead Conversion Rate" value={`${leadConversionRate.toFixed(1)}%`} icon={<PresentationChartLineIcon className="w-6 h-6 text-primary" />} iconBgColor="bg-primary/20" />
                <KpiCard title="Avg. Deal Value" value={formatCurrency(avgDealValue)} icon={<BanknotesIcon className="w-6 h-6 text-green-400" />} iconBgColor="bg-green-500/20" />
                <KpiCard title="Top Channel" value={topChannel} icon={<ChartBarIcon className="w-6 h-6 text-purple-400" />} iconBgColor="bg-purple-500/20" />
                <KpiCard title="Avg. Response Time" value="2.3 days" change="(mock data)" icon={<ClockIcon className="w-6 h-6 text-orange-400" />} iconBgColor="bg-orange-500/20" />
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-text-light-major">Lead Sources Performance</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sourcesPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke={textLightMinor} strokeOpacity={0.2} />
                            <XAxis dataKey="name" tick={{ fill: textLightMinor }} />
                            <YAxis unit="%" tick={{ fill: textLightMinor }} />
                            <Tooltip content={<CustomTooltip />} formatter={(value) => `${value}%`}/>
                            <Legend wrapperStyle={{ color: textLightMinor }} />
                            <Bar dataKey="Conversion Rate" fill="#00f0fe" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-text-light-major">Monthly Performance Trend</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrend}>
                             <CartesianGrid strokeDasharray="3 3" stroke={textLightMinor} strokeOpacity={0.2}/>
                             <XAxis dataKey="name" tick={{ fill: textLightMinor }} />
                             <YAxis tick={{ fill: textLightMinor }}/>
                             <Tooltip content={<CustomTooltip />} />
                             <Legend wrapperStyle={{ color: textLightMinor }} />
                             <Line type="monotone" dataKey="leads" stroke="#818cf8" name="Leads" strokeWidth={2} />
                             <Line type="monotone" dataKey="appointments" stroke="#4ade80" name="Appointments" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
             </div>
        </div>
    )
}

export default AnalyticsView;