# Aurum - Cryptocurrency Demo

Aurum is a fictitious cryptocurrency I built to better understand the advantages of blockchain technology. Check out the demo [here](https://kytha.github.io/aurum), or continue reading to learn how I built this demo.

## What is Blockchain?

A Blockchain is a distributed, immutable ledger of data secured through cryptography. I like to think of it as a democratic database, where **blocks** of information are **chained** together and anyone can add a new block. Let's take a look in detail.

#### Distributed

What I mean when I say blockchain is distributed, is that there is no centralized singular blockchain. Information on the blockchain is distrusted and synchronized consensually throughout a network of peers, and no singular peer has the authority, or even the ability, to dictate what is added to the blockchain alone.

Once we understand this, we can see why blockchain technology is famously used for cryptocurrencies. It removes the necessity for a bank that was previously necessary to validate transactions, track account balances, and keep score, so to speak.

Although this is the most famous use case of blockchains, it is by no means the only one. Blockchains are appealing to any data-transfer system where a centralized authority is cumbersome, or otherwise corrupting in nature to the system.

Banks can fail, be hacked, or just be corrupt. On top of that, any centralized authority exposes a single point of failure. If a bank is compromised, the entire ledger is now fraudulent. Whereas, if a single node on a blockchain is compromised, it does not pose a risk to the integrity of the ledger. This is not to imply blockchains don't have security vulnerabilities, just to highlight some of the advantages over centralized ledgers.

### Immutable

Blockchains are immutable. Simple put, this means once something is added to the blockchain it can't be removed or altered. I will discuss how this is achieved soon, but for now know that all blocks on the blockchain are permanent and blockchains only grow in size.

### Security

How exactly are blockchains secured? As I mentioned previously, the blockchain is shared among a network of peers, so how can we be sure each peer is an honest actor? How can we achieve trust on a network of unknown peers?

Well it turns out, we don't need to trust anyone or the network. We just need to trust the underlying technology **not the people using it**. The technology is rooted in mathematics, and I've always found math to be a very good source of truth.

The next section I'll actual explain how blockchains work which covers a lot of the security. I just wanted this section here to emphasis that with centralized ledgers, we are putting our trust in institutions and, in turn, humans. Blockchain allows us to accept that humans are untrustworthy and instead allows us to place our trust in **technology**.

## How a Blockchain Works

As I said before, a blockchain is chained blocks of information. In the case of cryptocurrencies, that information is transactions, so I will refer to it as such from now onward. Each block can be thought of as a "mini-ledger" of transactions; chained together chronologically to make up the entire ledger.

Transactions are broadcasted to every node when they occur. They are only valid once they've been added to a block and that block is subsequently added to the blockchain.

Each node listens for transactions, compiles them into blocks, and then broadcasts that block to be added to the blockchain. Adding new blocks to the blockchain is called mining.

### Reaching Consensus

However, not just any block can be added to the blockchain. In order for there to be consensus amongst the peers, each block must contain a valid "proof-of-work" (PoW). This way each node can independently verify that broadcasted blocks are legitimate and safe to add to their chain. Since each node is working with the same criteria, this ensures that blockchains are synchronized. The blockchain with the most "work" put into it (i.e the longest chain) is considered the valid chain.

For the case of Bitcoin and Aurum, the proof-of-work is done through hashes. Each block will have a hash associated with its data. Aurum uses SHA256 to produce hashes that change wildly with any change of data. Each block's hash must have a specific number of leading 0s in order for it to be a valid proof-of-work. In the case of Aurum it is 3. The hash of the block is computed as follows:

```javascript
export function calculateHash(
  index,
  previousHash,
  timestamp,
  transactions,
  nonce
) {
  const data =
    index + previousHash + timestamp + JSON.stringify(transactions) + nonce;

  return crypto.createHash("sha256").update(data).digest("hex");
}
```

The nonce value is a random integer that when added to the block, produces a hash which is valid (i.e. has 3 leading 0s). **There is no known way to figure out what the correct nonce is without trail and error**. The first miner to find the proof-of-work answer broadcasts their solution to the network. Here is a snippet for mining new blocks:

```javascript
export function generateNextBlock(previousBlock, transactions) {
  const index = previousBlock.index + 1;
  const previousHash = previousBlock.hash;
  let nonce = 0;
  let hash;
  let timestamp;
  // proof-of-work
  do {
    timestamp = new Date().getTime();
    nonce = nonce + 1;
    hash = calculateHash(index, previousHash, timestamp, transactions, nonce);
  } while (!isValidHashDifficulty(hash));

  return {
    index: index,
    previousHash: previousBlock.hash,
    timestamp: timestamp,
    transactions: transactions,
    hash: hash,
    nonce: nonce,
  };
}
```

It is important to note that mining is computational taxing, and therefore miners which successfully win the next block get to add a reward transaction to themselves onto the new block. Right now the current Bitcoin reward is 12.5 BTC.

After a block has been mined, all nodes are notified that a new block was discovered. They double-check the solution to ensure it is a valid block and then begin working on the next block. Here is a code snippet for validating new blocks:

```javascript
export function isValidNextBlock(nextBlock, previousBlock) {
  if (previousBlock.index + 1 !== nextBlock.index) {
    return false;
  } else if (previousBlock.hash !== nextBlock.previousHash) {
    return false;
  } else if (!isValidHashDifficulty(nextBlock.previousHash)) {
    return false;
  } else if (!isValidHashDifficulty(nextBlock.hash)) {
    return false;
  }
  return true;
}
```

With Aurum, sometimes nodes do not just request the latest block but the entire blockchain. This can happen when a node realizes they are out of sync with the blocks being broadcasted. Here is a snippet for verifying an entire chain of blocks received.

```javascript
export function isValidChain(chain, genesisBlock) {
  if (JSON.stringify(chain[0]) !== JSON.stringify(genesisBlock)) {
    return false;
  }

  const tempBlocks = [genesisBlock];
  for (let i = 1; i < chain.length; i = i + 1) {
    if (isValidNextBlock(chain[i], tempBlocks[i - 1])) {
      tempBlocks.push(chain[i]);
    } else {
      return false;
    }
  }
  return true;
}
```

### Security Considerations

This protocol ensures that no one can sneak fraudulent transactions into previously mined blocks. As you can see from the hashing equation, each block's hash contains the previous block's hash as input. Linking a block with the proof-of-work hash of its predecessor results in tamper resistance. Since every block’s hash is an ingredient in the next block’s hash, any alterations in the chain will alter the final proof-of-work hash and all block hashes in between. The deeper the altered block, the more computational effort needed for tampering. The last hash of the chain represents the cumulative work of the entire chain, similar to a checksum. This makes it computational infeasible to alter a block already on the chain.

This protocol also incentives miners to only focus on mining legitimate transactions. Peers only consider the longest chain (one with the most proof-of-work) as valid and authentic. A fraudulent chain is impractical over the long term because a miner has a low probability of consistently winning the block reward to maintain the chain. Over time, other miners will extend the valid chain faster than the tampered chain. Therefore adding fraudulent transactions is infeasible to do without collusion with over 50% of the computational power on the network.
