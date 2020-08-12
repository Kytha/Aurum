export const REQUEST_LATEST_BLOCK = 0;
export const RECEIVE_LATEST_BLOCK = 1;
export const REQUEST_BLOCKCHAIN = 2;
export const RECEIVE_BLOCKCHAIN = 3;
export const REQUEST_TRANSACTIONS = 4;
export const RECEIVE_LATEST_TRANSACTION = 5;
export const RECEIVE_TRANSACTIONS = 6;
export const RECEIVE_REMOVE_TRANSACTION = 7;

export const getLatestBlock = () => {
  return {
    type: REQUEST_LATEST_BLOCK,
  };
};

export const sendLatestBlock = (block) => {
  return {
    type: RECEIVE_LATEST_BLOCK,
    data: block,
  };
};

export const getBlockchain = () => {
  return {
    type: REQUEST_BLOCKCHAIN,
  };
};

export const sendBlockchain = (blockchain) => {
  return {
    type: RECEIVE_BLOCKCHAIN,
    data: blockchain,
  };
};

export const getTransactions = () => {
  return {
    type: REQUEST_TRANSACTIONS,
  };
};

export const sendTransactions = (transactions) => {
  return {
    type: RECEIVE_TRANSACTIONS,
    data: transactions,
  };
};

export const sendRemoveTransaction = (transaction) => {
  return {
    type: RECEIVE_REMOVE_TRANSACTION,
    data: transaction,
  };
};
