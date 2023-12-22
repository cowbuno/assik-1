const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
function askQuestion(query) {
    return new Promise(resolve => {
      readline.question(query, resolve);
    });
  }
  

const crypto = require('crypto');

function calculateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

class Block {
    constructor(index, data, prevHash) {
      this.index = index;
      this.timestamp = Date.now();
      this.data = data;
      this.prevHash = prevHash;
      this.hash = this.calculateHash();
    }
  
    calculateHash() {
      // Hashing functionality here
      return calculateHash(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
  }
  
class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
    }
  
    createGenesisBlock() {
      return new Block(0, "Genesis Block", "0");
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    addBlock(newBlock) {
      newBlock.prevHash = this.getLatestBlock().hash;
      newBlock.hash = newBlock.calculateHash();
      this.chain.push(newBlock);
    }
  
    // Add methods for transaction management and Merkle tree implementation
  }
  


async function main() {
    const myBlockchain = new Blockchain();
  
    while (true) {
      console.log("\n1. Add a new block");
      console.log("2. Print the blockchain");
      console.log("3. Exit");
  
      const action = await askQuestion("Choose an action (1-3): ");
  
      if (action === '1') {
        const data = await askQuestion("Enter block data: ");
        myBlockchain.addBlock(new Block(myBlockchain.chain.length, data, myBlockchain.getLatestBlock().hash));
        console.log("Block added!");
      } else if (action === '2') {
        console.log(JSON.stringify(myBlockchain, null, 2));
      } else if (action === '3') {
        break;
      } else {
        console.log("Invalid option, please choose again.");
      }
    }
  
    readline.close();
  }
  
  main();