import React from "react";
import { connect } from "react-redux";
import Peers from "./Peers";
import Node from "./Node";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  peers: {
    borderBottom: "rgba(0,0,0,0.12) solid 1px",
    padding: theme.spacing(2, 4),
  },
  node: {
    display: "flex",
    flexGrow: 1,
    flexWrap: "wrap",
  },
}));

const App = (props) => {
  const classes = useStyles();
  const { peers } = props;
  const [peerIndex, setPeerIndex] = React.useState(0);
  const currentPeer = peers[peerIndex];
  //console.log(peers[1].blockchain);
  return (
    <div className={classes.root}>
      <div className={classes.peers}>
        <Peers peers={peers} currentPeer={currentPeer} setPeer={setPeerIndex} />
      </div>
      <div className={classes.node}>
        {peers.map((peer, i) => {
          return (
            <Node
              key={i}
              setPeerIndex={setPeerIndex}
              blockchain={peer.blockchain || []}
              transactions={peer.transactions || []}
              toPeer={peer.address}
              connectedPeers={peer.connectedPeers}
              isCurrent={peerIndex === i}
            ></Node>
          );
        })}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    peers: state.peers,
  };
};
export default connect(mapStateToProps)(App);
