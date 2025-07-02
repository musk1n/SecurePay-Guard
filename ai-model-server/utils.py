def log_event(event):
    print(f"[LOG] {event}")

def validate_transaction(transaction):
    required_fields = ['amount', 'velocity', 'location']
    for field in required_fields:
        if field not in transaction:
            return False
    return True 