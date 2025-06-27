import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { setColorPalette } from "../state/context/actions";
import ColorPalettes from "../ui/ColorPalettes";

const RaceAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [palette, setPalette] = useState(state.colorPalette || "vibrant");

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
        <Typography>Race Appearance</Typography>
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default RaceAccordion;
