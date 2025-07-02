def extract_features(transaction):
    # Convert transaction dict to feature vector for ML model
    return [
        transaction.get('amount', 0),
        transaction.get('velocity', 0),
        # ... add more features as needed ...
    ] 