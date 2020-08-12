import React from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { getBalance } from "./utils";

const useStyles = makeStyles((theme) => ({
  card: {
    background: "linear-gradient(to left, #23074d, #cc5333)",
    padding: theme.spacing(4, 0),
    borderRadius: "15px",
    "&:hover": {
      boxShadow: theme.shadows[15],
    },
  },
  content: {
    textAlign: "center",
    color: "white",
  },
  number: {
    fontSize: "48pt",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0, 0, 1),
  },
  title: {
    fontSize: "22pt",
    fontWeight: 300,
  },
}));

const Wallet = ({ blockchain, peer }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography className={classes.number}>
          <span style={{ fontSize: "32pt" }}>֍</span>
          {getBalance(peer, blockchain)}
        </Typography>
        <Typography className={classes.title}>WALLET</Typography>
      </CardContent>
    </Card>
  );
};

export default Wallet;
