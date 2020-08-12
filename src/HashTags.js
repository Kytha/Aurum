import React from "react";
import Chip from "@material-ui/core/Chip";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: { main: green[500] },
    secondary: { main: red[500] },
  },
});

const useStyles = makeStyles((theme) => ({
  hash: {
    fontSize: "9pt",
    marginLeft: "5px",
    maxWidth: "100%",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1, 0, 0, 0),
    },
  },
  previousHash: {
    fontSize: "8pt",
    maxWidth: "100%",
    color: green[500],
    marginLeft: "5px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "inline",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      margin: theme.spacing(1, 0, 0, 0),
    },
  },
  hashContainer: {
    maxWidth: "100%",
    fontSize: "12px",
    marginBottom: "12px",
  },
}));

const HashTags = ({ hash, previousHash, previousBlock, ...props }) => {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.hashContainer}>
        HASH
        <Chip
          label={`${hash}`}
          color="primary"
          variant="outlined"
          classes={{ root: classes.hash }}
          {...props}
          size="small"
        />
      </div>
      <div style={{ fontSize: "12px" }}>
        PREVIOUS HASH <div className={classes.previousHash}>{previousHash}</div>
      </div>
    </MuiThemeProvider>
  );
};

export default HashTags;
