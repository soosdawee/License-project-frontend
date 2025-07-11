import React, { useContext, useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VisualizationContext } from "../state/context/VisualizationContext";
import {
  setCustomColors,
  setOpacity,
  setColorPalette,
  setShowPercentages,
} from "../state/context/actions";
import ColorPalettes from "../ui/ColorPalettes";

const clampValue = (val) => Math.max(0, Math.min(100, parseInt(val) || 0));

const AreaAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [colorsCustom, setColorsCursom] = useState(state.customColors || "");
  const [opacity, setLocalOpacity] = useState(state.opacity || 100);
  const [palette, setPalette] = useState(state.colorPalette || "vibrant");

  const ensureOpacityWithinBound = () => {
    const clamped = clampValue(opacity);
    if (clamped !== state.opacity) {
      dispatch(setOpacity(clamped));
    }
  };

  const handleKeyPress = (e, confirmFn) => {
    if (e.key === "Enter") confirmFn();
  };

  const handlePaletteChange = (event) => {
    const selectedLabel = event.target.value;

    const matchedKey = Object.keys(ColorPalettes).find(
      (key) => ColorPalettes[key].name === selectedLabel
    );

    if (matchedKey) {
      setPalette(matchedKey);
      dispatch(setColorPalette(matchedKey));
    }
  };

  const handleTogglePercentages = (e) => {
    dispatch(setShowPercentages(e.target.checked));
  };

  return (
    <Accordion disableGutters sx={{ borderBottom: "1px solid #e0dcdc" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Area Appearence</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Color Palette</InputLabel>
            <Select
              value={ColorPalettes[palette]?.name || ""}
              label="Color Palette"
              onChange={handlePaletteChange}
              size="small"
            >
              {Object.keys(ColorPalettes).map((key) => (
                <MenuItem key={key} value={ColorPalettes[key].name}>
                  {ColorPalettes[key].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography>Custom Color Overrides (comma-separated):</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Label A:#ff0000, Label B:#00ff00"
              value={colorsCustom}
              onChange={(e) => setColorsCursom(e.target.value)}
              onBlur={() => dispatch(setCustomColors(colorsCustom))}
              onKeyDown={(e) =>
                handleKeyPress(e, () => dispatch(setCustomColors(colorsCustom)))
              }
            />
          </Box>
          {state.vizType === "PIE_CHART" && (
            <Box display="flex" gap={2} alignItems="center">
              <Box>
                <Typography>Opacity:</Typography>
                <TextField
                  inputProps={{
                    min: 0,
                    max: 100,
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
                  onBlur={ensureOpacityWithinBound}
                  onKeyDown={(e) => handleKeyPress(e, ensureOpacityWithinBound)}
                />
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.showPercentages}
                    onChange={handleTogglePercentages}
                    sx={{
                      color: "#007393",
                      "&.Mui-checked": {
                        color: "#007393",
                      },
                    }}
                  />
                }
                label="Show percentages"
                sx={{ marginLeft: "auto" }}
              />
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AreaAccordion;
