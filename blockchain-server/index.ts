import express from 'express';
import cors from 'cors';
import { Blockchain, Transaction } from './blockchain';

const app = express();
const PORT = 4100;
const blockchain = new Blockchain();

app.use(cors());
app.use(express.json());

// Add a transaction to the mempool
app.post('/api/blockchain/transaction', (req, res) => {
  const tx: Transaction = req.body;
  if (!tx || !tx.from || !tx.to || typeof tx.amount !== 'number') {
    return res.status(400).json({ success: false, error: 'Invalid transaction format' });
  }
  tx.timestamp = new Date().toISOString();
  blockchain.addTransaction(tx);
  res.json({ success: true, message: 'Transaction added to mempool' });
});

// Mine a new block
app.post('/api/blockchain/mine', (req, res) => {
  const { miner } = req.body;
  if (!miner) return res.status(400).json({ success: false, error: 'Miner address required' });
  const block = blockchain.mineBlock(miner);
  if (!block) return res.json({ success: false, message: 'No transactions to mine' });
  res.json({ success: true, block });
});

// Get the full blockchain
app.get('/api/blockchain/chain', (req, res) => {
  res.json(blockchain.getChain());
});

// Get the mempool (pending transactions)
app.get('/api/blockchain/mempool', (req, res) => {
  res.json(blockchain.getMempool());
});

// Get the latest block
app.get('/api/blockchain/latest', (req, res) => {
  res.json(blockchain.getLatestBlock());
});

// Validate the chain (consensus)
app.get('/api/blockchain/consensus', (req, res) => {
  const valid = blockchain.validateChain();
  res.json({ valid });
});

// Set mining difficulty
app.post('/api/blockchain/difficulty', (req, res) => {
  const { difficulty } = req.body;
  if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 6) {
    return res.status(400).json({ success: false, error: 'Difficulty must be 1-6' });
  }
  blockchain.setDifficulty(difficulty);
  res.json({ success: true, difficulty });
});

// Set block reward
app.post('/api/blockchain/reward', (req, res) => {
  const { reward } = req.body;
  if (typeof reward !== 'number' || reward < 0) {
    return res.status(400).json({ success: false, error: 'Reward must be >= 0' });
  }
  blockchain.setBlockReward(reward);
  res.json({ success: true, reward });
});

app.listen(PORT, () => {
  console.log(`Blockchain server running on http://localhost:${PORT}`);
}); 