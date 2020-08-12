import React from "react";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import HashTags from "./HashTags";
import IndexTag from "./IndexTag";
import NonceTag from "./NonceTag";
import TransactionTable from "./TransactionTable";
import cx from "classnames";

const useStyles = makeStyles((theme) => ({
  meta: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  nonce: {
    marginLeft: "auto",
  },
  tag: {
    borderRadius: "4px",
    fontSize: "12px",
  },
  card: {
    "&:hover": {
      boxShadow: theme.shadows[15],
    },
    overflow: "visible",
    width: "100%",
    textAlign: "left",
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
}));

const Block = (props) => {
  const {
    hash,
    previousHash,
    index,
    currentPeer,
    transactions,
    blockchain,
    nonce,
    timestamp,
    previousBlock,
    bIndex,
  } = props;
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent>
        <TransactionTable
          transactions={transactions}
          blockchain={blockchain}
          currentPeer={currentPeer}
          bIndex={bIndex}
        />
        <HashTags
          hash={hash}
          previousHash={previousHash}
          previousBlock={previousBlock}
          className={classes.tag}
        />
        <div className={classes.meta}>
          <IndexTag
            index={index}
            timestamp={timestamp}
            className={classes.tag}
          />
          <NonceTag nonce={nonce} className={cx(classes.nonce, classes.tag)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default Block;
