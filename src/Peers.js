import React from "react";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import { addPeer } from "./actions";
import { connect } from "react-redux";
const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#00a854",
    },
    primary: {
      main: "#108EE9",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    overflow: "auto",
  },
  peer: {
    marginRight: theme.spacing(3),
  },
  selectedIcon: {
    backgroundColor: "rgba(16,142,233,0.05)",
  },
  addPeerIcon: {
    marginBottom: "19px",
  },
}));

const Peers = ({ peers, setPeer, currentPeer, addPeer }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        {peers.map((peer, i) => {
          const color =
            currentPeer.address === peer.address ? "primary" : "secondary";
          return (
            <div key={i} className={classes.peer}>
              <IconButton
                onClick={() => setPeer(i)}
                color={color}
                className={
                  currentPeer.address === peer.address
                    ? classes.selectedIcon
                    : null
                }
              >
                <PersonIcon color={color} />
              </IconButton>

              <Typography
                align="center"
                variant="caption"
                display="block"
                color={color}
              >
                {peer.name}
              </Typography>
            </div>
          );
        })}
        <div>
          <IconButton onClick={() => addPeer()} className={classes.addPeerIcon}>
            <PersonAddIcon />
          </IconButton>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default connect(null, { addPeer })(Peers);
