import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Header } from './Header';
import { StatsOverview } from './StatsOverview';
import { TransactionTable } from './TransactionTable';
import { FraudChart } from './FraudChart';
import { RealTimeMonitor } from './RealTimeMonitor';
import { Transaction } from '../types';
import { FraudDetectionEngine } from '../utils/fraudDetection';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'monitor'>('overview');

  useEffect(() => {
    // Initialize with some mock data
    const initialTransactions = Array.from({ length: 50 }, () => 
      FraudDetectionEngine.generateMockTransaction()
    );
    setTransactions(initialTransactions);

    // Simulate real-time transactions
    const interval = setInterval(() => {
      const newTransaction = FraudDetectionEngine.generateMockTransaction();
      setTransactions(prev => [newTransaction, ...prev.slice(0, 99)]); // Keep last 100
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fraudulentTransactions = transactions.filter(t => t.isFraudulent);
  const suspiciousTransactions = transactions.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'monitor', label: 'Real-Time Monitor' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StatsOverview transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FraudChart transactions={transactions} />
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                  {fraudulentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">${transaction.amount.toFixed(2)}</p>
                          <p className="text-gray-300 text-sm">{transaction.merchantId}</p>
                        </div>
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {transaction.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        Trust Score: {transaction.trustScore}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionTable transactions={transactions} />
        )}

        {activeTab === 'monitor' && (
          <RealTimeMonitor transactions={transactions} />
        )}
      </div>
    </div>
  );
};