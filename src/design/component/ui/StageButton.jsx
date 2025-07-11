import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";

const StageButton = ({ number, text, setState, state }) => {
  const isSelected = state === text;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: "20%",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isSelected ? "#c62828" : "#007393",
          clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
          zIndex: 0,
        },
      }}
    >
      <Button
        name={`stage-${number}`}
        variant="contained"
        onClick={() => setState(text)}
        sx={{
          position: "relative",
          px: 4,
          py: 1.5,
          width: "100%",
          backgroundColor: isSelected ? "#c62828" : "#ebebeb",
          color: isSelected ? "white" : "#007fa7",
          alignItems: "center",
          fontWeight: "bold",
          clipPath:
            "polygon(1.5px 1.5px, calc(90% - 0.5px) 1.5px, calc(100% - 2px) 50%, calc(90% - 0.5px) calc(100% - 1px), 1.5px calc(100% - 1px))",
          textTransform: "none",
          zIndex: 1,
          "&:hover": {
            backgroundColor: isSelected ? "#b71c1c" : "#f0f0f0",
          },
          minWidth: "unset",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: isSelected ? "#b71c1c" : "#f0f0f0",
            boxShadow: "none",
          },
        }}
      >
        <Box component="span" sx={{ mr: 1, fontSize: "1rem" }}>
          {number}.
        </Box>
        {text}
      </Button>
    </Box>
  );
};

StageButton.propTypes = {
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
};

export default StageButton;
