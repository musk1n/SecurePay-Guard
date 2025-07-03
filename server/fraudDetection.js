// Fraud detection and mock transaction generation for backend

const FRAUD_INDICATORS = {
  HIGH_AMOUNT_THRESHOLD: 5000,
  VELOCITY_THRESHOLD: 5,
  UNUSUAL_TIME_HOURS: [2, 3, 4, 5], // 2-5 AM
  SUSPICIOUS_LOCATIONS: ['Unknown', 'High Risk Zone'],
  CARD_TESTING_AMOUNTS: [1, 5, 10, 25, 50],
};

function detectFraud(transaction) {
  const reasons = [];
  let riskScore = 0;

  if (transaction.amount > FRAUD_INDICATORS.HIGH_AMOUNT_THRESHOLD) {
    reasons.push('Unusually high transaction amount');
    riskScore += 10; 
  }
  if (transaction.velocity > FRAUD_INDICATORS.VELOCITY_THRESHOLD) {
    reasons.push('High transaction velocity detected');
    riskScore += 8;
  }
  const hour = new Date(transaction.timestamp).getHours();
  if (FRAUD_INDICATORS.UNUSUAL_TIME_HOURS.includes(hour)) {
    reasons.push('Transaction at unusual hours (2-5 AM)');
    riskScore += 5;
  }
  if (FRAUD_INDICATORS.SUSPICIOUS_LOCATIONS.includes(transaction.location)) {
    reasons.push('Transaction from high-risk location');
    riskScore += 8; 
  }
  if (FRAUD_INDICATORS.CARD_TESTING_AMOUNTS.includes(transaction.amount)) {
    reasons.push('Amount matches card testing pattern');
    riskScore += 12;
  }
  if (transaction.deviceFingerprint && transaction.deviceFingerprint.includes('anomaly')) {
    reasons.push('Suspicious device fingerprint detected');
    riskScore += 8;
  }
  if (transaction.location && transaction.location.includes('Foreign')) {
    reasons.push('Transaction from unusual geographic location');
    riskScore += 8; 
  }
  if (transaction.ipAddress && transaction.ipAddress.startsWith('192.168.1.')) {
    reasons.push('Transaction from known proxy/VPN');
    riskScore += 5;
  }

  const trustScore = Math.max(0, 100 - riskScore);
  let riskLevel = 'low';
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';

  const isFraudulent = riskScore >= 50;

  return {
    isFraudulent,
    trustScore,
    riskLevel,
    reasons,
  };
}
function generateMockTransaction() {
  const merchants = ['AMAZON', 'WALMART', 'TARGET', 'BESTBUY', 'COSTCO'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Unknown', 'Foreign-Brazil'];
  const amounts = [29.99, 149.99, 599.99, 1299.99, 2599.99, 2099.99, 199.99, 499.99, 1699.99, 1999.99, 99.99, 25, 1, 5, 10, 7850.00];
  const id = Math.random().toString(36).substr(2, 9);
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  const velocity = Math.floor(Math.random() * 4);
  const location = locations[Math.floor(Math.random() * locations.length)];
  const transaction = {
    id,
    timestamp: new Date().toISOString(),
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
  const detection = detectFraud(transaction);
  transaction.trustScore = detection.trustScore;
  transaction.riskLevel = detection.riskLevel;
  transaction.isFraudulent = detection.isFraudulent;
  transaction.fraudReasons = detection.reasons;
  transaction.status = detection.isFraudulent ? 'flagged' : 'approved';
  return transaction;
}

module.exports = { detectFraud, generateMockTransaction }; 
