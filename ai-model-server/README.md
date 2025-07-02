# AI Model Server (Python)

This microservice simulates an AI-powered fraud detection model using Python and Flask.

## How to Run

1. Install Python 3.8+
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Start the server:
   ```
   python app.py
   ```
   The server will run on http://localhost:5001

## API

### POST /predict
- Request body:
  ```json
  {
    "transaction": { /* transaction object */ }
  }
  ```
- Response:
  ```json
  {
    "isFraudulent": true,
    "trustScore": 60,
    "riskLevel": "high",
    "reasons": ["High transaction amount"],
    "modelVersion": "1.0.0",
    "confidence": 0.6
  }
  ``` 