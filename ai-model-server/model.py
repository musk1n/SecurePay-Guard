def load_model():
    # In a real system, load a trained ML model from disk
    return None

def predict_fraud(transaction, model=None):
    # Simulate prediction logic
    amount = transaction.get('amount', 0)
    risk_score = 0
    if amount > 5000:
        risk_score += 30
    # ... more logic can be added here ...
    return {
        'risk_score': risk_score,
        'is_fraudulent': risk_score >= 50
    } 