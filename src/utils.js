import crypto from "crypto";
import names from "./names";
const MINING_REWARD = 50;
const DIFFICULTY = 3;
export const BLOCK_SIZE = 3;
export const INSUFFICIENT_FUNDS = "Insufficient funds";

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

export function isOutputSpent(output, currentPeer, blockchain) {
  const allTransactionInputs = getAllTransactionInputs(currentPeer, blockchain);
  const isSpent = allTransactionInputs.some((input) => {
    return JSON.stringify(input) === JSON.stringify(output);
  });
  if (isSpent) {
    return "SPENT";
  } else {
    return "UNSPENT";
  }
}

export function getTransactionsForBlock(transactions, address) {
  //addFeesToTransactions(transactions, address);
  transactions.push(createRewardTransaction(address));
  return transactions;
}

function createRewardTransaction(address) {
  return {
    type: "reward",
    inputs: [],
    outputs: [
      {
        amount: MINING_REWARD,
        address: address,
      },
    ],
  };
}

export function isValidHashDifficulty(hash) {
  for (var i = 0, b = hash.length; i < b; i++) {
    if (hash[i] !== "0") {
      break;
    }
  }
  return i >= DIFFICULTY;
}

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

export function getBalance(address, blockchain) {
  if (!blockchain) return 0;
  const unspentTxOutputs = getUnspentTransactionOutputs(address, blockchain);
  return unspentTxOutputs.reduce((sum, a) => sum + a.amount, 0);
}

export function getUnspentTransactionOutputs(peer, blockchain) {
  let inputs = getAllTransactionInputs(peer, blockchain);
  let outputs = getAllTransactionOutputs(peer, blockchain);

  const unspentTransactionOutputs = filterSpentOutputs(outputs, inputs);
  return unspentTransactionOutputs;
}

export function filterSpentOutputs(outputs, inputs) {
  return outputs.filter(
    (output) =>
      !inputs.some((input) => JSON.stringify(input) === JSON.stringify(output))
  );
}

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

export function getValidateTransaction(
  amount,
  sender,
  blockchain,
  recipient,
  unconfirmedTxs
) {
  const unspentTxOutputs = getUnspentTransactionOutputs(sender, blockchain)
    .sort((a, b) => a.amount - b.amount)
    .filter((tx) => {
      return !getInputsfromTransactions(unconfirmedTxs).some((utx) => {
        return JSON.stringify(utx) === JSON.stringify(tx);
      });
    });
  const balance = unspentTxOutputs.reduce((sum, a) => sum + a.amount, 0);
  if (balance < amount) return INSUFFICIENT_FUNDS;

  const consumedTransactions = [];
  let i = 0;
  do {
    consumedTransactions.push(unspentTxOutputs[i]);
    i++;
  } while (consumedTransactions.reduce((sum, a) => sum + a.amount, 0) < amount);

  const consumedAmount = consumedTransactions.reduce(
    (sum, a) => sum + a.amount,
    0
  );
  const change = consumedAmount - amount;
  let transaction = {
    type: "regular",
    inputs: consumedTransactions,
    outputs: [{ amount: parseInt(amount), address: recipient }],
  };
  if (change > 0) {
    transaction.outputs.push({ amount: change, address: sender });
  }
  return transaction;
}

export function getAllTransactionInputs(address, blockchain) {
  let inputs = [];
  if (!blockchain) return inputs;
  blockchain.forEach((block) => {
    block.transactions.forEach((transaction) => {
      transaction.inputs.forEach((input) => {
        inputs.push({
          transaction: input.transaction,
          amount: input.amount,
          address: input.address,
        });
      });
    });
  });
  return inputs;
}

function getAllTransactionOutputs(address, blockchain) {
  let outputs = [];
  blockchain.forEach((block, blockIndex) => {
    block.transactions.forEach((transaction, transactionIndex) => {
      transaction.outputs.forEach((output, outputIndex) => {
        if (output.address === address) {
          outputs.push({
            transaction: [blockIndex, transactionIndex, outputIndex],
            amount: output.amount,
            address: output.address,
          });
        }
      });
    });
  });
  return outputs;
}

function getInputsfromTransactions(transactions) {
  let inputs = [];
  transactions.forEach((transaction, transactionIndex) => {
    transaction.inputs.forEach((input, outputIndex) => {
      inputs.push(input);
    });
  });
  return inputs;
}

export const generateName = (existingNames = []) => {
  const filteredNames = names.filter((name) => !existingNames.includes(name));
  return filteredNames[Math.floor(Math.random() * filteredNames.length)];
};
