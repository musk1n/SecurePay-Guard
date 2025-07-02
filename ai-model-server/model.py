def load_model():
    return {"name": "SimulatedGradientBoostingClassifier"}

def predict_fraud(transaction, model=None):
    reasons = []
    risk_score = 0

    if transaction.get('amount', 0) > 5000:
        risk_score += 30
        reasons.append("High transaction amount")
    if transaction.get('velocity', 0) > 5:
        risk_score += 25
        reasons.append("Unusual velocity")
    if transaction.get('location', '') in ['Unknown', 'High Risk Zone']:
        risk_score += 20
        reasons.append("Suspicious location")

    return {
        'risk_score': risk_score,
        'is_fraudulent': risk_score >= 50,
        'reasons': reasons
    }
