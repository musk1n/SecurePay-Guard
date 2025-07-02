const express = require('express');
const cors = require('cors');
const {
  addTransaction,
  minePendingTransactions,
  getChain,
  getPendingTransactions,
  BLOCK_SIZE,
} = require('./fakeChain');

const app = express();
const PORT = 4100;

app.use(cors());
app.use(express.json());

// Queue a transaction for the next block
app.post('/api/blockchain/record', (req, res) => {
  const { transaction } = req.body;
  if (!transaction) {
    return res.status(400).json({ success: false, error: 'No transaction provided' });
  }
  addTransaction(transaction);
  res.json({ success: true, message: 'Transaction queued for next block', blockSize: BLOCK_SIZE });
});

// Force mining a block (for demo/testing)
app.post('/api/blockchain/mine', (req, res) => {
  const block = minePendingTransactions();
  if (!block) return res.json({ success: false, message: 'No pending transactions to mine' });
  res.json({ success: true, block });
});

// Get the full blockchain
app.get('/api/blockchain/chain', (req, res) => {
  res.json(getChain());
});

// Get pending transactions
app.get('/api/blockchain/pending', (req, res) => {
  res.json(getPendingTransactions());
});

app.listen(PORT, () => {
  console.log(`Fake blockchain server running on http://localhost:${PORT}`);
}); 