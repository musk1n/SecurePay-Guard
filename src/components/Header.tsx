import React from 'react';
import { Shield, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SecurePay Guard</h1>
              <p className="text-sm text-gray-300">Fraud Detection Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <UserIcon className="w-5 h-5 text-gray-300" />
              <div className="text-right">
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-gray-300 text-xs">
                  {user.role === 'store_manager' ? 'Store Manager' : 'Security Analyst'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};