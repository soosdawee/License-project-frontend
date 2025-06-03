import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState, useContext } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { setBackgroundColor } from "../state/context/actions";

const ColorAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [backgroundType, setBackgroundType] = useState(
    state.backgroundColor === "transparent" ? "transparent" : "custom"
  );
  const [color, setColor] = useState(
    state.backgroundColor === "transparent" ? "#ffffff" : state.backgroundColor
  );

  const handleBackgroundTypeChange = (_, newValue) => {
    if (!newValue) return;
    setBackgroundType(newValue);
    if (newValue === "transparent") {
      dispatch(setBackgroundColor("transparent"));
    } else {
      dispatch(setBackgroundColor(color));
    }
  };

  const commitColorChange = () => {
    if (backgroundType === "custom") {
      dispatch(setBackgroundColor(color));
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Background</Typography>
      </AccordionSummary>
      <AccordionDetails
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <ToggleButtonGroup
          value={backgroundType}
          exclusive
          onChange={handleBackgroundTypeChange}
          aria-label="background type"
        >
          <ToggleButton value="transparent">
            Transparent background
          </ToggleButton>
          <ToggleButton value="custom">Customize background</ToggleButton>
        </ToggleButtonGroup>

        {backgroundType === "custom" && (
          <div onMouseUp={commitColorChange}>
            <HexColorPicker color={color} onChange={setColor} />
            <HexColorInput
              color={color}
              onChange={setColor}
              style={{ marginTop: "8px" }}
              onBlur={commitColorChange}
            />
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ColorAccordion;
