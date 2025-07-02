const express = require('express');
const cors = require('cors');
const { generateMockTransaction } = require('./fraudDetection');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Endpoint to get initial batch of transactions
app.get('/api/transactions', (req, res) => {
  const transactions = Array.from({ length: 50 }, () => generateMockTransaction());
  res.json(transactions);
});

// Endpoint to get a new real-time transaction
app.get('/api/transaction', (req, res) => {
  const transaction = generateMockTransaction();
  res.json(transaction);
});

app.listen(PORT, () => {
  console.log(`Fake AI backend running on http://localhost:${PORT}`);
}); 