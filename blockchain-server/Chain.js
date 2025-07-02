const crypto = require('crypto');

const DIFFICULTY = 3; // Number of leading zeros required in hash
const BLOCK_SIZE = 5; // Transactions per block

let chain = [];
let pendingTransactions = [];

function calculateHash(block) {
  return crypto.createHash('sha256')
    .update(
      block.index + block.previousHash + block.timestamp + JSON.stringify(block.transactions) + block.nonce
    )
    .digest('hex');
}

function createGenesisBlock() {
  const genesisBlock = {
    index: 0,
    timestamp: new Date().toISOString(),
    transactions: [],
    previousHash: '0',
    nonce: 0,
    hash: '',
  };
  genesisBlock.hash = calculateHash(genesisBlock);
  return genesisBlock;
}

function getLatestBlock() {
  return chain[chain.length - 1];
}

function mineBlock(transactions) {
  const previousBlock = getLatestBlock();
  const block = {
    index: previousBlock.index + 1,
    timestamp: new Date().toISOString(),
    transactions,
    previousHash: previousBlock.hash,
    nonce: 0,
    hash: '',
  };
  // Fake proof-of-work
  while (true) {
    block.hash = calculateHash(block);
    if (block.hash.startsWith('0'.repeat(DIFFICULTY))) break;
    block.nonce++;
  }
  chain.push(block);
  return block;
}

function addTransaction(transaction) {
  pendingTransactions.push(transaction);
  if (pendingTransactions.length >= BLOCK_SIZE) {
    minePendingTransactions();
  }
}

function minePendingTransactions() {
  if (pendingTransactions.length === 0) return null;
  const txs = pendingTransactions.splice(0, BLOCK_SIZE);
  return mineBlock(txs);
}

function getChain() {
  return chain;
}

function getPendingTransactions() {
  return pendingTransactions;
}

// Initialize chain with genesis block
if (chain.length === 0) {
  chain.push(createGenesisBlock());
}

module.exports = {
  addTransaction,
  minePendingTransactions,
  getChain,
  getPendingTransactions,
  BLOCK_SIZE,
}; 