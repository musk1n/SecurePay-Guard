import { calculateMerkleRoot } from './merkle';
import crypto from 'crypto';

export interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  [key: string]: any;
}

export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  previousHash: string;
  nonce: number;
  hash: string;
  merkleRoot: string;
  miner: string;
  reward: number;
}

export class Blockchain {
  private chain: Block[] = [];
  private mempool: Transaction[] = [];
  private difficulty: number = 3;
  private blockReward: number = 10;

  constructor() {
    this.chain.push(this.createGenesisBlock());
  }

  private createGenesisBlock(): Block {
    const genesis: Block = {
      index: 0,
      timestamp: new Date().toISOString(),
      transactions: [],
      previousHash: '0',
      nonce: 0,
      hash: '',
      merkleRoot: '',
      miner: 'genesis',
      reward: 0,
    };
    genesis.merkleRoot = calculateMerkleRoot([]);
    genesis.hash = this.calculateHash(genesis);
    return genesis;
  }

  private calculateHash(block: Block): string {
    return crypto.createHash('sha256')
      .update(
        block.index + block.previousHash + block.timestamp +
        JSON.stringify(block.transactions) + block.nonce + block.merkleRoot + block.miner + block.reward
      )
      .digest('hex');
  }

  public addTransaction(tx: Transaction) {
    this.mempool.push(tx);
  }

  public mineBlock(miner: string): Block | null {
    if (this.mempool.length === 0) return null;
    const transactions = this.mempool.splice(0, this.mempool.length);
    const previousBlock = this.chain[this.chain.length - 1];
    const block: Block = {
      index: previousBlock.index + 1,
      timestamp: new Date().toISOString(),
      transactions,
      previousHash: previousBlock.hash,
      nonce: 0,
      hash: '',
      merkleRoot: calculateMerkleRoot(transactions.map(tx => JSON.stringify(tx))),
      miner,
      reward: this.blockReward,
    };
    // Proof-of-work
    while (true) {
      block.hash = this.calculateHash(block);
      if (block.hash.startsWith('0'.repeat(this.difficulty))) break;
      block.nonce++;
    }
    this.chain.push(block);
    return block;
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public getMempool(): Transaction[] {
    return this.mempool;
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];
      if (current.previousHash !== prev.hash) return false;
      if (current.hash !== this.calculateHash(current)) return false;
      if (current.merkleRoot !== calculateMerkleRoot(current.transactions.map(tx => JSON.stringify(tx)))) return false;
    }
    return true;
  }

  public setDifficulty(difficulty: number) {
    this.difficulty = difficulty;
  }

  public setBlockReward(reward: number) {
    this.blockReward = reward;
  }
} 