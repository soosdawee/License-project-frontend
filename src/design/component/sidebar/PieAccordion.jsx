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

const PieAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);

  const [overrides, setOverrides] = useState(state.customColors || "");
  const [opacity, setLocalOpacity] = useState(state.opacity || 100);
  const [palette, setPalette] = useState(state.colorPalette || "vibrant");

  const confirmOpacity = () => {
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
        <Typography>
          {state.vizType === "PIE_CHART" ? "Pie Appearance" : "Line Appearance"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Color Palette</InputLabel>
            <Select
              name="color-palette"
              data-testid="color-palette-select"
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
          {state.vizType === "PIE_CHART" && (
            <Box display="flex" gap={2} alignItems="center">
              <Box>
                <Typography>Opacity (0-100):</Typography>
                <TextField
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
                label="Show %"
                sx={{ marginLeft: "auto" }}
              />
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default PieAccordion;
