import { Transaction } from '../types';

export class FraudDetectionEngine {
  private static readonly FRAUD_INDICATORS = {
    HIGH_AMOUNT_THRESHOLD: 5000,
    VELOCITY_THRESHOLD: 5,
    UNUSUAL_TIME_HOURS: [2, 3, 4, 5], // 2-5 AM
    SUSPICIOUS_LOCATIONS: ['Unknown', 'High Risk Zone'],
    CARD_TESTING_AMOUNTS: [1, 5, 10, 25, 50],
  };

  static detectFraud(transaction: Transaction): {
    isFraudulent: boolean;
    trustScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
  } {
    const reasons: string[] = [];
    let riskScore = 0;

    // High amount detection
    if (transaction.amount > this.FRAUD_INDICATORS.HIGH_AMOUNT_THRESHOLD) {
      reasons.push('Unusually high transaction amount');
      riskScore += 30;
    }

    // Velocity-based detection
    if (transaction.velocity > this.FRAUD_INDICATORS.VELOCITY_THRESHOLD) {
      reasons.push('High transaction velocity detected');
      riskScore += 25;
    }

    // Time-based detection
    const hour = transaction.timestamp.getHours();
    if (this.FRAUD_INDICATORS.UNUSUAL_TIME_HOURS.includes(hour)) {
      reasons.push('Transaction at unusual hours (2-5 AM)');
      riskScore += 15;
    }

    // Location-based detection
    if (this.FRAUD_INDICATORS.SUSPICIOUS_LOCATIONS.includes(transaction.location)) {
      reasons.push('Transaction from high-risk location');
      riskScore += 20;
    }

    // Card testing detection
    if (this.FRAUD_INDICATORS.CARD_TESTING_AMOUNTS.includes(transaction.amount)) {
      reasons.push('Amount matches card testing pattern');
      riskScore += 35;
    }

    // Device fingerprint anomaly
    if (transaction.deviceFingerprint.includes('anomaly')) {
      reasons.push('Suspicious device fingerprint detected');
      riskScore += 25;
    }

    // Geographic anomaly
    if (transaction.location.includes('Foreign')) {
      reasons.push('Transaction from unusual geographic location');
      riskScore += 20;
    }

    // IP address analysis
    if (transaction.ipAddress.startsWith('192.168.1.')) {
      reasons.push('Transaction from known proxy/VPN');
      riskScore += 15;
    }

    // Calculate trust score (inverse of risk)
    const trustScore = Math.max(0, 100 - riskScore);
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 70) riskLevel = 'critical';
    else if (riskScore >= 50) riskLevel = 'high';
    else if (riskScore >= 30) riskLevel = 'medium';
    else riskLevel = 'low';

    const isFraudulent = riskScore >= 50;

    return {
      isFraudulent,
      trustScore,
      riskLevel,
      reasons,
    };
  }

  static generateMockTransaction(): Transaction {
    const merchants = ['AMAZON', 'WALMART', 'TARGET', 'BESTBUY', 'COSTCO'];
    const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Unknown', 'Foreign-Brazil'];
    const amounts = [29.99, 149.99, 599.99, 1299.99, 2599.99, 25, 1, 5, 10, 7850.00];
    
    const id = Math.random().toString(36).substr(2, 9);
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const velocity = Math.floor(Math.random() * 8);
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const transaction: Transaction = {
      id,
      timestamp: new Date(),
      amount,
      cardNumber: `****-****-****-${Math.floor(1000 + Math.random() * 9000)}`,
      merchantId: merchants[Math.floor(Math.random() * merchants.length)],
      location,
      customerEmail: `customer${Math.floor(Math.random() * 1000)}@email.com`,
      isOnline: Math.random() > 0.3,
      trustScore: 0,
      riskLevel: 'low',
      isFraudulent: false,
      fraudReasons: [],
      velocity,
      deviceFingerprint: Math.random() > 0.8 ? 'device-anomaly-detected' : 'device-normal',
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      status: 'pending',
    };

    // Apply fraud detection
    const detection = this.detectFraud(transaction);
    transaction.trustScore = detection.trustScore;
    transaction.riskLevel = detection.riskLevel;
    transaction.isFraudulent = detection.isFraudulent;
    transaction.fraudReasons = detection.reasons;
    transaction.status = detection.isFraudulent ? 'flagged' : 'approved';

    return transaction;
  }
}