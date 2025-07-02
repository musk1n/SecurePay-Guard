def extract_features(transaction):
    return [
        transaction.get('amount', 0),
        transaction.get('velocity', 0),
        transaction.get('location', ''),
        transaction.get('timestamp', ''),
        transaction.get('deviceFingerprint', ''),
        transaction.get('ipAddress', '')
    ]

