const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
function askQuestion(query) {
    return new Promise(resolve => {
      readline.question(query, resolve);
    });
  }

  const { encrypt,decrypt } = require('./encryption');  
  const { generateKeys, signData, verifySignature } = require('./digitalSignature');
  // Generate a new public/private key pair (This should be done securely and stored for a real app)
const { publicKey, privateKey } = generateKeys();


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

    getDecryptedData() {
        if (this.data) {
          return decrypt(this.data);
        }
        return null;
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
      console.log("3. Decrypt and print the latest block");
      console.log("4. Exit");
  
      const action = await askQuestion("Choose an action (1-4): ");
  
      if (action === '1') {
        let data = await askQuestion("Enter block data: ");
        const encryptedData = encrypt(data);  // Encrypting the data
        const dataToSign = JSON.stringify(encryptedData); // Converting encrypted data to a string to sign it
        const signature = signData(dataToSign, privateKey); // Signing the encrypted data
        const newBlock = new Block(myBlockchain.chain.length, encryptedData, myBlockchain.getLatestBlock().hash);
        newBlock.signature = signature; // Storing the signature in the block
        myBlockchain.addBlock(newBlock);
        console.log("Block added with encrypted data and signature!");
      } 
         else if (action === '2') {
        console.log(JSON.stringify(myBlockchain, null, 2));
      } 
      else if (action === '3') {
        const latestBlock = myBlockchain.getLatestBlock();
        if (latestBlock) {
            const dataToVerify = JSON.stringify(latestBlock.data);
            const isValid = verifySignature(dataToVerify, latestBlock.signature, publicKey);
            console.log("Decrypted Data of the latest block:", decrypt(latestBlock.data));
            console.log("Signature valid:", isValid);
        } else {
            console.log("No blocks to decrypt or verify.");
        }
    }
    // sabakkka.
     
      else if (action === '4') {
        break;
      } else {
        console.log("Invalid option, please choose again.");
      }
    }
  
    readline.close();
}

  
  main();