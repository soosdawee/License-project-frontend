import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { HexColorPicker, HexColorInput } from "react-colorful";

import { setBarColor } from "../state/context/actions";

const BubbleAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);

  const [color, setColor] = useState(state.barColor || "#00000");

  const handleChangeColor = () => {
    if (state.barColor !== color) {
      dispatch(setBarColor(color));
    }
  };

  return (
    <Accordion disableGutters sx={{ borderBottom: "1px solid #e0dcdc" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Appearance</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box>
            <Typography>Default Bubble Color:</Typography>
            <div onMouseUp={handleChangeColor}>
              <HexColorPicker color={color} onChange={setColor} />
              <HexColorInput
                color={color}
                onChange={setColor}
                style={{ marginTop: "8px" }}
                onBlur={handleChangeColor}
              />
            </div>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default BubbleAccordion;
