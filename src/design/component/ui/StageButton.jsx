import React from "react";
import { Button, Box } from "@mui/material";
import { PropTypes } from "prop-types";

const StageButton = ({ number, text, setState }) => {
  return (
    <Button
      variant="contained"
      onClick={() => setState(text)}
      sx={{
        px: 4,
        py: 1.5,
        width: "20%",
        backgroundColor: "#c62828",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
        inset: "30%, 30%, 30%, 30%, 30%, 30%",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#b71c1c",
        },
        strokeLinejoin: "round",
      }}
    >
      <Box component="span" sx={{ mr: 1, fontSize: "1rem" }}>
        {number}
      </Box>
      {text}
    </Button>
  );
};

StageButton.prototypes = {
  number: PropTypes.func.isRequired,
  text: PropTypes.func.isRequired,
};

export default StageButton;
