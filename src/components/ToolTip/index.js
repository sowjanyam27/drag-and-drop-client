import React from "react";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Tooltip from "@material-ui/core/Tooltip";

export default function index({ text }) {
  return (
    <Tooltip title={text} arrow>
      <HelpOutlineIcon style={{ fontSize: "medium" }} />
    </Tooltip>
  );
}
