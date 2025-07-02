# from flask import Flask, request, jsonify
# from datetime import datetime

# app = Flask(__name__)

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json.get('transaction', {})
#     # Simulate AI logic (replace with real model inference as needed)
#     amount = data.get('amount', 0)
#     velocity = data.get('velocity', 0)
#     location = data.get('location', '')
#     risk_score = 0
#     reasons = []
#     if amount > 5000:
#         risk_score += 30
#         reasons.append('High transaction amount')
#     if velocity > 5:
#         risk_score += 25
#         reasons.append('High transaction velocity')
#     if location in ['Unknown', 'High Risk Zone']:
#         risk_score += 20
#         reasons.append('Suspicious location')
#     trust_score = max(0, 100 - risk_score)
#     risk_level = 'low'
#     if risk_score >= 70:
#         risk_level = 'critical'
#     elif risk_score >= 50:
#         risk_level = 'high'
#     elif risk_score >= 30:
#         risk_level = 'medium'
#     is_fraudulent = risk_score >= 50
#     return jsonify({
#         'isFraudulent': is_fraudulent,
#         'trustScore': trust_score,
#         'riskLevel': risk_level,
#         'reasons': reasons,
#         'modelVersion': '1.0.0',
#         'confidence': trust_score / 100.0
#     })

# if __name__ == '__main__':
#     app.run(port=5001, debug=True) 

from flask import Flask, request, jsonify
from datetime import datetime
from model import load_model, predict_fraud
from utils import validate_transaction, log_event
from features import extract_features
import time

app = Flask(__name__)

# Load fake model
model = load_model()
model_version = "1.0.3-prod"

@app.route('/predict', methods=['POST'])
def predict():
    start_time = time.time()
    
    transaction = request.json.get('transaction', {})
    if not validate_transaction(transaction):
        return jsonify({'error': 'Invalid transaction data'}), 400

    # Extract features
    features = extract_features(transaction)
    
    # Simulate model inference
    result = predict_fraud(transaction, model)
    
    risk_score = result['risk_score']
    trust_score = max(0, 100 - risk_score)
    
    if risk_score >= 70:
        risk_level = 'critical'
    elif risk_score >= 50:
        risk_level = 'high'
    elif risk_score >= 30:
        risk_level = 'medium'
    else:
        risk_level = 'low'
    
    is_fraudulent = risk_score >= 50
    confidence = round(trust_score / 100.0, 2)
    
    # Simulate response delay
    time.sleep(0.25)  # 250ms latency
    
    log_event(f"Prediction for TX: {transaction.get('id', 'N/A')} | Fraud: {is_fraudulent} | Score: {trust_score}%")

    return jsonify({
        'isFraudulent': is_fraudulent,
        'trustScore': trust_score,
        'riskLevel': risk_level,
        'reasons': result.get('reasons', []),
        'modelVersion': model_version,
        'confidence': confidence,
        'processingTimeMs': int((time.time() - start_time) * 1000)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'modelVersion': model_version,
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
