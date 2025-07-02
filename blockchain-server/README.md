# Blockchain Server

This is a mock blockchain server for demo purposes.

## How to Run

1. Open a terminal and navigate to this folder:
   ```
   cd blockchain-server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   The server will run on http://localhost:4100

## API

### POST /api/blockchain/record
Pretends to record a transaction to the blockchain and returns a fake transaction hash.

**Request Body:**
```json
{
  "transaction": { /* transaction object */ }
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x..."
}
``` 