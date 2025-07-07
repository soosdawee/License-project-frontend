import React, { useContext, useState } from "react";
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
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { setCustomColors, setColorPalette } from "../state/context/actions";
import ColorPalettes from "../ui/ColorPalettes";

const ElectionResultsAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);

  const [overrides, setOverrides] = useState(state.customColors || "");
  const [palette, setPalette] = useState(state.colorPalette || "vibrant");

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

  return (
    <Accordion disableGutters sx={{ borderBottom: "1px solid #e0dcdc" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Appearance</Typography>
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ElectionResultsAccordion;
