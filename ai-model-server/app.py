from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get('transaction', {})
    # Simulate AI logic (replace with real model inference as needed)
    amount = data.get('amount', 0)
    velocity = data.get('velocity', 0)
    location = data.get('location', '')
    risk_score = 0
    reasons = []
    if amount > 5000:
        risk_score += 30
        reasons.append('High transaction amount')
    if velocity > 5:
        risk_score += 25
        reasons.append('High transaction velocity')
    if location in ['Unknown', 'High Risk Zone']:
        risk_score += 20
        reasons.append('Suspicious location')
    trust_score = max(0, 100 - risk_score)
    risk_level = 'low'
    if risk_score >= 70:
        risk_level = 'critical'
    elif risk_score >= 50:
        risk_level = 'high'
    elif risk_score >= 30:
        risk_level = 'medium'
    is_fraudulent = risk_score >= 50
    return jsonify({
        'isFraudulent': is_fraudulent,
        'trustScore': trust_score,
        'riskLevel': risk_level,
        'reasons': reasons,
        'modelVersion': '1.0.0',
        'confidence': trust_score / 100.0
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True) 