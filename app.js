const { thisExpression } = require('@babel/types');
const SHA256 = require('crypto-js/sha256');

class CryptoBlock {
    constructor(index, timestamp, data, precedingHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.nonce = 0;
        this.hash = this.computeHash();
    }
    computeHash() {
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    proofOfWork(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.computeHash()
        }
    }
}
class CryptoBlockchain {
    constructor(dif = 4) {
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = dif;
    }
    startGenesisBlock() {
        return new CryptoBlock(0, "02/05/2020", "initial block", "0");
    }
    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }
    checkChainValidity() {
        for (let k = 1; k < thisExpression.blockchain.length; k++) {
            const current = this.blockchain[k];
            const last = this.blockchain[k - 1];
            if (current.hash !== current.computeHash()) {
                return false;
            }
            if (current.precedingHash !== last.hash) {
                return false;
            }
        }
        return true;
    }
}

// test
let blacksheep = new CryptoBlockchain(2);
blacksheep.addNewBlock(new CryptoBlock(1, "02/05/2020", { sender: "Calvin Kinateder", recipient: "Linus Dombrosky", amount: 20 }));
blacksheep.addNewBlock(new CryptoBlock(2, "02/05/2020", { sender: "Calvin Kinateder", recipient: "Andrew Puckett", amount: 65 }));
console.log(JSON.stringify(blacksheep, null, 4));