import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  index: {
    fontSize: "1.6rem",
  },
  timestamp: {
    fontSize: "0.8rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const IndexTag = ({ index, timestamp }) => {
  const classes = useStyles();
  const date = new Date(timestamp).toUTCString();
  return (
    <Typography>
      <span className={classes.index}>BLOCK #{index}</span>
      <span className={classes.timestamp}> on {date}</span>
    </Typography>
  );
};

export default IndexTag;
