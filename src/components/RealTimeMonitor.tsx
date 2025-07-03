import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Shield, Zap } from 'lucide-react';
import { Transaction } from '../types';

interface RealTimeMonitorProps {
  transactions: Transaction[];
}

export const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({ transactions }) => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [processingCount, setProcessingCount] = useState(0);

  useEffect(() => {
    // Keep track of recent transactions (last 10)
    setRecentTransactions(transactions.slice(0, 10));
  }, [transactions]);

  useEffect(() => {
    // Simulate processing counter
    const interval = setInterval(() => {
      setProcessingCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentFraudRate = transactions.length > 0 
    ? ((transactions.filter(t => t.isFraudulent).length / transactions.length) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Processing Rate</p>
              <p className="text-2xl font-bold text-white">{processingCount}/min</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Live Fraud Rate</p>
              <p className="text-2xl font-bold text-white">{currentFraudRate}%</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">System Status</p>
              <p className="text-2xl font-bold text-green-400">ACTIVE</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Transaction Feed */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="text-xl font-semibold text-white">Live Transaction Feed</h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recentTransactions.map((transaction, index) => (
            <div 
              key={transaction.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                transaction.isFraudulent 
                  ? 'bg-red-500/20 border-red-500/30' 
                  : 'bg-white/5 border-white/10'
              } ${index === 0 ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.isFraudulent ? 'bg-red-500/20' : 'bg-green-500/20'
                    }`}>
                      {transaction.isFraudulent ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Shield className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        ${transaction.amount.toFixed(2)} - {transaction.merchantId}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {transaction.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {transaction.isFraudulent && (
                    <div className="mt-2 ml-11">
                      <p className="text-red-300 text-sm font-medium">
                        Fraud Detected - Trust Score: {transaction.trustScore}%
                      </p>
                      <p className="text-red-200 text-xs">
                        {transaction.fraudReasons[0]}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.riskLevel === 'critical' ? 'bg-red-500 text-white' :
                    transaction.riskLevel === 'high' ? 'bg-orange-500 text-white' :
                    transaction.riskLevel === 'medium' ? 'bg-yellow-500 text-black' :
                    'bg-green-500 text-white'
                  }`}>
                    {transaction.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

{/*       ML Model Status */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">ML Model Status</h3>
{/*         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Detection Algorithms</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Isolation Forest</span>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Velocity Analysis</span>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Pattern Recognition</span>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Geographic Analysis</span>
                <span className="text-green-400 text-sm">Active</span>
              </div>
            </div> 
          </div>*/}
          <div>
            <h4 className="text-white font-medium mb-3">Performance Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Accuracy</span>
                <span className="text-green-400 text-sm">94.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Precision</span>
                <span className="text-green-400 text-sm">92.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Recall</span>
                <span className="text-green-400 text-sm">96.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Response Time</span>
                <span className="text-green-400 text-sm">{'< 100ms'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
