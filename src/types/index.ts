export interface User {
  id: string;
  name: string;
  role: 'store_manager' | 'security_analyst';
  email: string;
}

export interface Transaction {
  id: string;
  timestamp: Date;
  amount: number;
  cardNumber: string;
  merchantId: string;
  location: string;
  customerEmail: string;
  isOnline: boolean;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  isFraudulent: boolean;
  fraudReasons: string[];
  velocity: number;
  deviceFingerprint: string;
  ipAddress: string;
  status: 'pending' | 'approved' | 'declined' | 'flagged';
}

export interface FraudStats {
  totalTransactions: number;
  fraudulentTransactions: number;
  suspiciousTransactions: number;
  blockedAmount: number;
  averageTrustScore: number;
  topFraudReasons: Array<{ reason: string; count: number }>;
}