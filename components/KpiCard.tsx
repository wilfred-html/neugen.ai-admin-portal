import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeColor?: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, icon, iconBgColor, changeColor = 'text-green-400' }) => {
  return (
    <div className="bg-card-dark rounded-xl p-6 border border-border-dark shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-text-light-minor text-sm font-medium">{title}</span>
      </div>
      <div className="text-3xl font-bold mb-1 text-text-light-major">{value}</div>
      {change && <div className={`text-sm ${changeColor}`}>{change}</div>}
    </div>
  );
};

export default KpiCard;