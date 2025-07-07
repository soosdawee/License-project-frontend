import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { HexColorPicker, HexColorInput } from "react-colorful";

import {
  setBarColor,
  setCustomColors,
  setOpacity,
  setBarSpacing,
} from "../state/context/actions";

const clampValue = (val) => Math.max(0, Math.min(100, parseInt(val) || 0));

const BarChartColorAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);

  const [color, setColor] = useState(state.barColor || "#60002");
  const [overrides, setOverrides] = useState(state.customColors || "");
  const [opacity, setLocalOpacity] = useState(state.opacity || 100);
  const [spacing, setLocalSpacing] = useState(state.barSpacing || 25);

  const confirmOpacity = () => {
    const clamped = clampValue(opacity);
    if (clamped !== state.opacity) {
      dispatch(setOpacity(clamped));
    }
  };

  const confirmSpacing = () => {
    const clamped = clampValue(spacing);
    if (clamped !== state.barSpacing) {
      dispatch(setBarSpacing(clamped));
    }
  };

  const handleKeyPress = (e, confirmFn) => {
    if (e.key === "Enter") confirmFn();
  };

  const commitColorChange = () => {
    if (state.barColor !== color) {
      dispatch(setBarColor(color));
    }
  };

  return (
    <Accordion disableGutters sx={{ borderBottom: "1px solid #e0dcdc" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Bar Appearance</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography>Default Bar Color:</Typography>
            <div onMouseUp={commitColorChange}>
              <HexColorPicker color={color} onChange={setColor} />
              <HexColorInput
                data-testid="bar-color-input"
                color={color}
                onChange={setColor}
                style={{ marginTop: "8px" }}
                onBlur={commitColorChange}
              />
            </div>
          </Box>

          <Box>
            <Typography>Custom Color Overrides (comma-separated):</Typography>
            <TextField
              name="color-overrides"
              fullWidth
              size="small"
              placeholder="Label A:#ff0000, Label B:#00ff00"
              value={overrides}
              onChange={(e) => setOverrides(e.target.value)}
              onBlur={() => dispatch(setCustomColors(overrides))}
              onKeyDown={(e) =>
                handleKeyPress(e, () => dispatch(setCustomColors(overrides)))
              }
            />
          </Box>

          <Box display="flex" gap={2}>
            <Box>
              <Typography>Bar Opacity (0-100):</Typography>
              <TextField
                name="bar-opacity"
                type="number"
                inputProps={{
                  min: 0,
                  max: 100,
                  style: { MozAppearance: "textfield" },
                }}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "auto",
                      margin: 0,
                    },
                  width: "100px",
                }}
                value={opacity}
                onChange={(e) => setLocalOpacity(e.target.value)}
                onBlur={confirmOpacity}
                onKeyDown={(e) => handleKeyPress(e, confirmOpacity)}
              />
            </Box>

            <Box>
              <Typography>Bar Spacing (0-100):</Typography>
              <TextField
                name="bar-spacing"
                type="number"
                inputProps={{
                  min: 0,
                  max: 100,
                  style: { MozAppearance: "textfield" },
                }}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "auto",
                      margin: 0,
                    },
                  width: "100px",
                }}
                value={spacing}
                onChange={(e) => setLocalSpacing(e.target.value)}
                onBlur={confirmSpacing}
                onKeyDown={(e) => handleKeyPress(e, confirmSpacing)}
              />
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default BarChartColorAccordion;
