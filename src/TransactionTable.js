import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { isOutputSpent } from "./utils";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 350,
    marginBottom: theme.spacing(3),
  },
  dataRow: {
    transition: "all ease-in-out 0.3s",
    "&:hover": {
      background: "rgba(98,194,226,0.2)",
    },
  },
}));

export default function TransactionTable(props) {
  const classes = useStyles();
  const { transactions, blockchain, currentPeer, bIndex } = props;
  const outputs = [];
  transactions.forEach((transaction, tIndex) =>
    transaction.outputs.forEach((output, oIndex) => {
      outputs.push({
        from: {
          value: getFrom(transaction.type, transaction.inputs, output.address),
          title: "From",
        },
        to: {
          value: "...".concat(output.address.substr(output.address.length - 3)),
          title: "To",
        },
        status: {
          value: isOutputSpent(
            { transaction: [bIndex, tIndex, oIndex], ...output },
            currentPeer,
            blockchain
          ),
          title: "Status",
        },
        amount: { value: output.amount, title: "Amount" },
      });
    })
  );
  return (
    <div style={{ display: "block", width: "100%", overflow: "auto" }}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            {outputs.length
              ? Object.keys(outputs[0]).map((key) => (
                  <TableCell key={key}>{outputs[0][key].title}</TableCell>
                ))
              : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {outputs.map((output, i) => {
            const keys = Object.keys(output);
            return (
              <TableRow key={i} className={classes.dataRow}>
                {keys.map((key) => (
                  <TableCell align="left" key={key}>
                    {output[key].value}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function getFrom(type, inputs, toAddress) {
  switch (type) {
    case "reward":
      return "REWARD";
    case "fee":
      return "FEE";
    case "regular":
      const fromAddress = inputs[0].address;
      if (fromAddress === toAddress) {
        return "CHANGE";
      } else {
        return "...".concat(fromAddress.substr(fromAddress.length - 3));
      }
  }
}
