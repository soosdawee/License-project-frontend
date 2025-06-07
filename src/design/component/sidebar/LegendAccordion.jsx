import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { setShowLegend, setTransitionTime } from "../state/context/actions";

const LegendAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [localTransitionTime, setLocalTransitionTime] = useState(
    state.transitionTime || 750
  );

  const handleCheckboxChange = (e) => {
    dispatch(setShowLegend(e.target.checked));
  };

  const handleBlurTransitionTime = () => {
    if (localTransitionTime !== state.transitionTime) {
      dispatch(setTransitionTime(localTransitionTime));
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Legend</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.showLegend}
              onChange={handleCheckboxChange}
            />
          }
          label="Show Legend"
        />
        {state.showLegend && (
          <TextField
            label="Transition Time"
            type="number"
            value={localTransitionTime}
            onChange={(e) => setLocalTransitionTime(e.target.value)}
            onBlur={handleBlurTransitionTime}
            sx={{ flex: 1 }}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default LegendAccordion;
