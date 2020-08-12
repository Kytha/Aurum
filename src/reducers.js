import { combineReducers } from "redux";
import {
  ADD_BLOCK,
  ADD_PEER,
  REPLACE_BLOCKCHAIN,
  ADD_TRANSACTION,
  CONNECT_PEER,
  DISCONNECT_PEER,
  REMOVE_TRANSACTION,
  REPLACE_TRANSACTIONS,
} from "./actions";
import { generateName } from "./utils";
import { makeWallet } from "./crypto";

export function genesisBlock() {
  return {
    index: 0,
    previousHash: "0",
    timestamp: 1508270000000,
    transactions: [],
    hash: "000231f48b131b1c721b508434cdbf308b0ae7c1a7f6a5ed7db56a34c76c9530",
    nonce: 2176,
  };
}

function node(currentNames) {
  const wallet = makeWallet();
  return {
    name: generateName(currentNames),
    address: wallet.publicAddress,
    blockchain: [genesisBlock()],
    connectedPeers: [],
    transactions: [],
    privateKey: wallet.privateKey,
  };
}

const initalWallet = makeWallet();
const secondWallet = makeWallet();

const node2Address = "9723097djewnf23djef";

export const initialNode = {
  name: "Ceaser",
  address: initalWallet.publicAddress,
  blockchain: [genesisBlock()],
  connectedPeers: [{ address: secondWallet.publicAddress, messages: [] }],
  transactions: [],
  privateKey: initalWallet.privateKey,
};

const initialNode2 = {
  name: "Nero",
  address: secondWallet.publicAddress,
  blockchain: [genesisBlock()],
  connectedPeers: [{ address: initalWallet.publicAddress, messages: [] }],
  transactions: [],
  privateKey: secondWallet.privateKey,
};

function peers(state = [initialNode, initialNode2], action) {
  switch (action.type) {
    case ADD_PEER:
      return [...state, node(state.map((peer) => peer.name))];
    case ADD_BLOCK:
      return state.map((node) => {
        if (node.address === action.payload.address) {
          node.blockchain = [...node.blockchain, action.payload.block];
        }
        return node;
      });
    case ADD_TRANSACTION:
      return state.map((node) => {
        if (node.address === action.payload.address) {
          node.transactions = [
            ...node.transactions,
            action.payload.transaction,
          ];
        }
        return node;
      });
    case REPLACE_BLOCKCHAIN:
      return state.map((node) => {
        if (node.address === action.payload.address) {
          node.blockchain = action.payload.blockchain;
        }
        return node;
      });
    case CONNECT_PEER:
      return state.map((node) => {
        if (node.peer === action.payload.fromPeer) {
          const newConnectedPeer = {
            address: action.payload.toPeer,
            messages: [],
          };
          node.connectedPeers = [...node.connectedPeers, newConnectedPeer];
        }
        return node;
      });

    case REPLACE_TRANSACTIONS:
      return state.map((node) => {
        if (node.address === action.payload.address) {
          node.transactions = action.payload.transactions;
        }
        return node;
      });
    case DISCONNECT_PEER:
      return state.map((node) => {
        if (node.peer === action.fromPeer) {
          node.connectedPeers = node.connectedPeers.filter(
            (peer) => peer.address !== action.toPeer
          );
        }
        return node;
      });

    case REMOVE_TRANSACTION:
      return state.map((node) => {
        if (node.peer === action.payload.address) {
          node.transactions = node.transactions.filter((transaction) => {
            return (
              JSON.stringify(transaction) !==
              JSON.stringify(action.payload.transaction)
            );
          });
        }
        return node;
      });
    default:
      return state;
  }
}

const reducers = combineReducers({
  peers,
});

export default reducers;
