import React from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import HardHatIcon from "./HardHatIcon";
import { generateNextBlock, getTransactionsForBlock } from "./utils";
import { addBlock, removeTransaction } from "./actions";
import { connect } from "react-redux";
import TransactionSelect from "./TransactionSelect";

const useStyles = makeStyles((theme) => ({
  card: {
    background: "linear-gradient(to right, #e55d87, #5fc3e4)",
    padding: theme.spacing(1, 0),
    borderRadius: "15px",
    "&:hover": {
      boxShadow: theme.shadows[15],
    },
  },
  transactionSelect: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0, 3),
  },
  content: {
    textAlign: "center",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    "&:last-child": {
      paddingBottom: "16px",
    },
  },
  button: {
    color: "white",
    borderColor: "white",
    marginBottom: theme.spacing(1),
  },
  icon: {
    margin: theme.spacing(0, 2, 0, 0),
  },
}));

const Mine = (props) => {
  const classes = useStyles();
  const {
    latestBlock,
    addBlock,
    peer,
    unvalidatedTransactions,
    removeTransaction,
  } = props;
  const [transactionsToMine, setTransactionsToMine] = React.useState([]);
  const onMine = (e) => {
    addBlock(
      generateNextBlock(
        latestBlock,
        getTransactionsForBlock([...transactionsToMine], peer)
      ),
      peer
    );
    transactionsToMine.forEach((transaction) => removeTransaction(transaction));
    setTransactionsToMine([]);
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        {unvalidatedTransactions && unvalidatedTransactions.length ? (
          <div className={classes.transactionSelect}>
            <TransactionSelect
              options={unvalidatedTransactions}
              onChange={(e, value) => {
                setTransactionsToMine(value);
              }}
            />
          </div>
        ) : null}
        <Button className={classes.button} variant="outlined" onClick={onMine}>
          <HardHatIcon className={classes.icon} />
          Mine new block
        </Button>
        <Typography variant="caption">Reward: ֍50</Typography>
      </CardContent>
    </Card>
  );
};

export default connect(null, { addBlock, removeTransaction })(Mine);
