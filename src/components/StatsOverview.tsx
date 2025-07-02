import React from 'react';
import { AlertTriangle, Shield, TrendingUp, DollarSign } from 'lucide-react';
import { Transaction } from '../types';

interface StatsOverviewProps {
  transactions: Transaction[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ transactions }) => {
  const fraudulentCount = transactions.filter(t => t.isFraudulent).length;
  const blockedAmount = transactions
    .filter(t => t.isFraudulent)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const averageTrustScore = transactions.length > 0 
    ? Math.round(transactions.reduce((sum, t) => sum + t.trustScore, 0) / transactions.length)
    : 0;

  const fraudRate = transactions.length > 0 
    ? ((fraudulentCount / transactions.length) * 100).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Total Transactions',
      value: transactions.length.toLocaleString(),
      icon: TrendingUp,
      color: 'blue',
      change: '+12.5%',
    },
    {
      title: 'Fraud Rate',
      value: `${fraudRate}%`,
      icon: AlertTriangle,
      color: fraudulentCount > 0 ? 'red' : 'green',
      change: '-2.1%',
    },
    {
      title: 'Amount Blocked',
      value: `$${blockedAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'yellow',
      change: '+$15.2K',
    },
    {
      title: 'Avg Trust Score',
      value: `${averageTrustScore}%`,
      icon: Shield,
      color: averageTrustScore > 70 ? 'green' : averageTrustScore > 50 ? 'yellow' : 'red',
      change: '+3.2%',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-400';
      case 'red':
        return 'bg-red-500/20 text-red-400';
      case 'green':
        return 'bg-green-500/20 text-green-400';
      case 'yellow':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className={`text-sm mt-1 ${
                stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change} from last week
              </p>
            </div>
            <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};