import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Shield, Eye } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.merchantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.cardNumber.includes(searchTerm);
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'fraudulent' && transaction.isFraudulent) ||
      (filterStatus === 'suspicious' && (transaction.riskLevel === 'high' || transaction.riskLevel === 'critical')) ||
      (filterStatus === 'safe' && transaction.riskLevel === 'low');

    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-500 bg-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'flagged': return 'text-red-400 bg-red-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'declined': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Transaction Monitor</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all" className="bg-slate-800">All Transactions</option>
              <option value="fraudulent" className="bg-slate-800">Fraudulent</option>
              <option value="suspicious" className="bg-slate-800">Suspicious</option>
              <option value="safe" className="bg-slate-800">Safe</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Time</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Merchant</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Trust Score</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Risk Level</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 px-4 text-gray-300 text-sm">
                  {transaction.timestamp.toLocaleTimeString()}
                </td>
                <td className="py-3 px-4 text-white font-medium">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {transaction.merchantId}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Shield className={`w-4 h-4 ${
                      transaction.trustScore > 70 ? 'text-green-400' :
                      transaction.trustScore > 50 ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <span className="text-white">{transaction.trustScore}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(transaction.riskLevel)}`}>
                    {transaction.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Transaction ID</p>
                  <p className="text-white font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-white font-bold">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Trust Score</p>
                  <p className="text-white">{selectedTransaction.trustScore}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Risk Level</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedTransaction.riskLevel)}`}>
                    {selectedTransaction.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {selectedTransaction.fraudReasons.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Fraud Indicators</p>
                  <div className="space-y-2">
                    {selectedTransaction.fraudReasons.map((reason, index) => (
                      <div key={index} className="flex items-start space-x-2 bg-red-500/20 p-2 rounded">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-red-300 text-sm">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};