import React, { Component } from "react";
import { connect } from "react-redux";
import { initalNode } from "./reducers";
import { isValidChain, isValidNextBlock } from "./utils";
import BlockChain from "./BlockChain";
import cx from "classnames";
import Payment from "./Payment";
import Wallet from "./Wallet";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Mine from "./Mine";
import { withStyles } from "@material-ui/core/styles";
import {
  replaceBlockchain,
  connectPeer,
  disconnectPeer,
  addTransaction,
  removeTransaction,
  replaceTransactions,
  addBlock,
} from "./actions";

import {
  incomingConnection,
  disconnectingConnection,
  incomingData,
  sendData,
  removeConnectListener,
  removeDisconnectListener,
  removeDataListener,
  connectToPeer,
} from "./p2p.js";

import {
  REQUEST_LATEST_BLOCK,
  RECEIVE_LATEST_BLOCK,
  REQUEST_BLOCKCHAIN,
  RECEIVE_BLOCKCHAIN,
  REQUEST_TRANSACTIONS,
  RECEIVE_LATEST_TRANSACTION,
  RECEIVE_TRANSACTIONS,
  RECEIVE_REMOVE_TRANSACTION,
  getLatestBlock,
  sendLatestBlock,
  getBlockchain,
  sendBlockchain,
  getTransactions,
  sendTransactions,
  sendRemoveTransaction,
} from "./messages";

const styles = (theme) => ({
  gridItem: {
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(3, 0),
    },
  },
  divider: {
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
    [theme.breakpoints.down("sm")]: {
      height: "0",
    },
  },
  panels: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: theme.spacing(3, 0),
  },
  blockchainCol: {
    [theme.breakpoints.up("md")]: {
      width: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "auto",
      padding: theme.spacing(5, 2),
      borderLeft: "none",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "calc(100vh - 105px)",
    overflowY: "auto",
    padding: theme.spacing(3, 3),
    borderLeft: "rgba(0,0,0,0.12) solid 1px",
  },
});

class Node extends Component {
  constructor(props) {
    super(props);
    this.handleIncomingConnection = this.handleIncomingConnection.bind(this);
    this.handleDisconnectingConnection = this.handleDisconnectingConnection.bind(
      this
    );
    this.handleIncomingData = this.handleIncomingData.bind(this);
    this.handleBlockchainChange = this.handleBlockchainChange.bind(this);
    this.handleReceivedLatestBlock = this.handleReceivedLatestBlock.bind(this);
  }
  render() {
    const {
      blockchain,
      toPeer,
      isCurrent,
      transactions,
      connectedPeers,
      addBlock,
      classes,
    } = this.props;
    if (!isCurrent) return null;
    return (
      <>
        <div style={{ flexGrow: 1 }}>
          <Grid container className={classes.panels}>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              className={classes.gridItem}
            >
              <Mine
                latestBlock={blockchain[blockchain.length - 1]}
                peer={toPeer}
                unvalidatedTransactions={transactions}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              className={classes.gridItem}
            >
              <Wallet blockchain={blockchain} peer={toPeer}></Wallet>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={5}
              className={classes.gridItem}
            >
              <Payment
                peer={toPeer}
                blockchain={blockchain}
                unvalidatedTransactions={transactions}
              />
            </Grid>
          </Grid>
        </div>
        <div className={cx(classes.gridItem, classes.blockchainCol)}>
          <BlockChain blockchain={blockchain} currentPeer={toPeer} />
        </div>
      </>
    );
  }

  componentDidMount(prevProps, prevState) {
    const { toPeer, connectedPeers } = this.props;
    incomingConnection(this.handleIncomingConnection);
    incomingData(this.handleIncomingData);
    disconnectingConnection(this.handleDisconnectingConnection);
  }

  componentWillUnmount() {
    removeConnectListener(this.handleIncomingConnection);
    removeDisconnectListener(this.handleDisconnectingConnection);
    removeDataListener(this.handleIncomingData);
  }

  componentDidUpdate(prevProps) {
    const { transactions, blockchain } = this.props;
    if (blockchain != prevProps.blockchain)
      this.handleBlockchainChange(blockchain, prevProps.blockchain);
    if (transactions != prevProps.blockchain)
      this.handleTxsChange(transactions, prevProps.transactions);
  }

  handleTxsChange(currentTxs, previousTxs) {
    if (currentTxs.length > previousTxs.length) {
      this.broadcast(sendTransactions(this.props.transactions));
    } else if (currentTxs.length < previousTxs.length) {
      previousTxs.forEach((prevTx) => {
        if (!currentTxs.includes(prevTx)) {
          this.broadcast(sendRemoveTransaction(prevTx));
        }
      });
    }
  }

  handleIncomingConnection(fromPeer, toPeer, fromLatestBlock) {
    const { connectPeer, connectedPeers } = this.props;
    if (this.props.toPeer === toPeer) {
      connectPeer(toPeer, fromPeer);
      sendData(toPeer, fromPeer, getLatestBlock());
      sendData(toPeer, fromPeer, getTransactions());
    }
  }

  handleDisconnectingConnection(fromPeer, toPeer) {
    const { disconnectPeer } = this.props;
    if (this.props.toPeer === toPeer) {
      disconnectPeer(toPeer, fromPeer);
    }
  }

  handleIncomingData(fromPeer, toPeer, data) {
    if (this.props.toPeer === toPeer) {
      this.handleMessage(fromPeer, toPeer, data);
    }
  }

  handleBlockchainChange(currentBlockchain, previousBlockchain) {
    if (
      previousBlockchain &&
      currentBlockchain.length > previousBlockchain.length
    ) {
      const latestBlock = currentBlockchain[currentBlockchain.length - 1];
      this.broadcast(sendLatestBlock(latestBlock));
    }
  }

  handleReceivedLatestBlock(fromPeer, toPeer, block) {
    const { blockchain, addBlock } = this.props;
    const latestBlockReceived = JSON.parse(JSON.stringify(block));
    const latestBlockHeld = blockchain[blockchain.length - 1];
    if (latestBlockReceived.index <= latestBlockHeld.index) return;
    if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
      if (isValidNextBlock(latestBlockReceived, latestBlockHeld)) {
        addBlock(latestBlockReceived, toPeer);
      }
    } else if (latestBlockReceived.index > latestBlockHeld.index) {
      sendData(toPeer, fromPeer, getBlockchain());
    }
  }

  handleReceivedBlockchain(fromPeer, toPeer, blockchainFromPeer) {
    const { replaceBlockchain, blockchain } = this.props;
    const receivedBlockchain = JSON.parse(JSON.stringify(blockchainFromPeer));
    if (receivedBlockchain.length > blockchain.length) {
      const genesisBlock = blockchain[0];
      if (isValidChain(receivedBlockchain, genesisBlock)) {
        replaceBlockchain(receivedBlockchain, toPeer);
      }
    }
  }

  handleReceivedTransactions(fromPeer, toPeer, newTxs) {
    const { transactions, replaceTransactions } = this.props;
    const combinedTx = [...new Set([...transactions, ...newTxs])];

    if (JSON.stringify(combinedTx) !== JSON.stringify(transactions)) {
      replaceTransactions(combinedTx, toPeer);
    }
  }

  broadcast(message) {
    const { toPeer, connectedPeers } = this.props;
    connectedPeers.forEach((connectedPeer) => {
      const fromPeer = connectedPeer.address;
      sendData(toPeer, fromPeer, message);
    });
  }

  handleMessage(fromPeer, toPeer, message) {
    const {
      blockchain,
      addTransaction,
      removeTransaction,
      transactions,
    } = this.props;
    switch (message.type) {
      case REQUEST_LATEST_BLOCK:
        const latestBlock = blockchain[blockchain.length - 1];
        sendData(toPeer, fromPeer, sendLatestBlock(latestBlock));
        break;
      case REQUEST_BLOCKCHAIN:
        sendData(toPeer, fromPeer, sendBlockchain(blockchain));
        break;
      case RECEIVE_BLOCKCHAIN:
        this.handleReceivedBlockchain(fromPeer, toPeer, message.data);
        break;
      case RECEIVE_LATEST_BLOCK:
        this.handleReceivedLatestBlock(fromPeer, toPeer, message.data);
        break;
      case REQUEST_TRANSACTIONS:
        sendData(toPeer, fromPeer, sendTransactions(transactions));
        break;
      case RECEIVE_TRANSACTIONS:
        this.handleReceivedTransactions(fromPeer, toPeer, message.data);
        break;
      case RECEIVE_LATEST_TRANSACTION:
        addTransaction(message.data, toPeer);
        break;
      case RECEIVE_REMOVE_TRANSACTION:
        removeTransaction(message.data, toPeer);
        break;
      default:
        throw new Error("invalid message");
    }
  }
}

export default withStyles(styles)(
  connect(null, {
    replaceBlockchain,
    connectPeer,
    addBlock,
    replaceTransactions,
    removeTransaction,
  })(Node)
);
