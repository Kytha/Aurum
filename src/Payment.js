import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { connect } from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { getValidateTransaction, INSUFFICIENT_FUNDS } from "./utils";
import { addTransaction } from "./actions";

const useStyles = makeStyles((theme) => ({
  card: {
    background: "linear-gradient(to bottom, #9796f0, #fbc7d4)",
    padding: theme.spacing(4, 4),
    borderRadius: "15px",
    "&:hover": {
      boxShadow: theme.shadows[15],
    },
  },
  button: {
    color: "white",
    borderColor: "white",
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
  formControl: {
    marginBottom: theme.spacing(5),
    width: "100%",
    maxWidth: "300px",
  },
  textField: {
    marginBottom: theme.spacing(5),
    width: "100%",
    maxWidth: "300px",
  },
}));

const StyledTextField = withStyles((theme) => ({
  root: {
    "& .MuiFormLabel-root": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
}))(TextField);

const Payment = (props) => {
  const classes = useStyles();
  const {
    peer,
    peers,
    blockchain,
    addTransaction,
    unvalidatedTransactions,
  } = props;
  const [toAddress, setToAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const makePayment = () => {
    const transaction = getValidateTransaction(
      amount,
      peer,
      blockchain,
      toAddress,
      unvalidatedTransactions
    );
    if (transaction === INSUFFICIENT_FUNDS) {
      return;
    }
    addTransaction(transaction, peer);
  };
  const onChange = (func) => (e) => {
    func(e.target.value);
  };
  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <FormControl
          className={classes.formControl}
          variant="outlined"
          size="small"
        >
          <InputLabel
            htmlFor="address-native-simple"
            style={{ color: "white" }}
            shrink={true}
          >
            Address
          </InputLabel>
          <Select
            inputProps={{
              name: "address",
            }}
            value={toAddress}
            onChange={onChange(setToAddress)}
            label="Address"
            notched={true}
          >
            {peers.map((p) => {
              if (p.address === peer) return;
              return (
                <MenuItem value={p.address} key={p.address}>
                  {p.address} [{p.name}]
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <StyledTextField
          id="number"
          label="Amount"
          type="number"
          size="small"
          value={amount}
          onChange={onChange(setAmount)}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />

        <Button
          className={classes.button}
          variant="outlined"
          onClick={makePayment}
        >
          ↁ Pay
        </Button>
      </CardContent>
    </Card>
  );
};
const mapStateToProps = (state) => {
  return {
    peers: state.peers,
  };
};
export default connect(mapStateToProps, { addTransaction })(Payment);
