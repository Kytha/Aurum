export const ADD_BLOCK = "ADD_BLOCK";
export const ADD_PEER = "ADD_PEER";
export const REPLACE_BLOCKCHAIN = "REPLACE_CHAIN";
export const ADD_TRANSACTION = "ADD_TRANSACTION";
export const DISCONNECT_PEER = "DISCONNECT_PEER";
export const CONNECT_PEER = "CONNECT_PEER";
export const REMOVE_TRANSACTION = "REMOVE_TRANSACTION";
export const REPLACE_TRANSACTIONS = "REPLACE_TRANSACTIONS";

export const addBlock = (block, peerAddress) => (dispatch, getState) => {
  dispatch({
    type: ADD_BLOCK,
    payload: { block: block, address: peerAddress },
  });
};

export const addPeer = () => (dispatch, getState) => {
  dispatch({ type: ADD_PEER });
};

export const connectPeer = (fromPeer, toPeer) => (dispatch, getState) => {
  dispatch({ type: CONNECT_PEER, payload: { fromPeer, toPeer } });
};

export const disconnectPeer = (fromPeer, toPeer) => (dispatch, getState) => {
  dispatch({ type: DISCONNECT_PEER, payload: { fromPeer, toPeer } });
};

export const replaceBlockchain = (blockchain, address) => (
  dispatch,
  getState
) => {
  dispatch({
    type: REPLACE_BLOCKCHAIN,
    payload: { blockchain: blockchain, address: address },
  });
};

export const addTransaction = (transaction, address) => (
  dispatch,
  getState
) => {
  dispatch({
    type: ADD_TRANSACTION,
    payload: { transaction, address },
  });
};

export const replaceTransactions = (transactions, address) => (
  dispatch,
  getState
) => {
  dispatch({
    type: REPLACE_TRANSACTIONS,
    payload: { transactions, address },
  });
};

export const removeTransaction = (transaction, address) => (
  dispatch,
  getState
) => {
  dispatch({
    type: REMOVE_TRANSACTION,
    payload: { transaction, address },
  });
};
