import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Block from "./Block";

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2, 0),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
}));

const BlockChain = (props) => {
  const classes = useStyles();
  const { blockchain, previousBlock, currentPeer } = props;
  return (
    <>
      <Typography variant="h4" className={classes.title}>
        BLOCKCHAIN
      </Typography>
      {blockchain.map((block, i, a) => {
        const {
          timestamp,
          previousHash,
          hash,
          transactions,
          nonce,
          index,
        } = block;
        return (
          <div key={index} style={{ textAlign: "center", width: "100%" }}>
            <Block
              {...block}
              blockchain={blockchain}
              previousBlock={previousBlock}
              currentPeer={currentPeer}
              bIndex={i}
            />
            {index != a.length - 1 && (
              <div className={classes.divider}>
                <KeyboardArrowDownIcon />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default BlockChain;
