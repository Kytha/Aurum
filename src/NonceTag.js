import React from "react";
import Chip from "@material-ui/core/Chip";

const Nonce = ({ nonce, ...props }) => {
  return <Chip label={nonce} size="small" {...props} variant="outlined" />;
};

export default Nonce;
