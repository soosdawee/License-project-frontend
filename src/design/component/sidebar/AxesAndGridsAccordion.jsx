import React, { useContext, useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VisualizationContext } from "../state/context/VisualizationContext";
import {
  setXAxisLabel,
  setYAxisLabel,
  setAreLabelsVisible,
  setShowGrids,
} from "../state/context/actions";

const AxesAndGridsAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [localXLabel, setLocalXLabel] = useState(state.xAxisLabel);
  const [localYLabel, setLocalYLabel] = useState(state.yAxisLabel);

  useEffect(() => {
    setLocalXLabel(state.xAxisLabel);
    setLocalYLabel(state.yAxisLabel);
  }, [state.xAxisLabel, state.yAxisLabel]);

  const handleBlurX = () => {
    if (localXLabel !== state.xAxisLabel) {
      dispatch(setXAxisLabel(localXLabel));
    }
  };

  const handleBlurY = () => {
    if (localYLabel !== state.yAxisLabel) {
      dispatch(setYAxisLabel(localYLabel));
    }
  };

  const handleToggleLabels = (e) => {
    dispatch(setAreLabelsVisible(e.target.checked));
  };

  const handleToggleGrids = (e) => {
    dispatch(setShowGrids(e.target.checked));
  };

  return (
    <Accordion disableGutters square sx={{ boxShadow: "none", mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Axes & Grids</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        <TextField
          label="X Axis Label"
          fullWidth
          margin="dense"
          value={localXLabel}
          onChange={(e) => setLocalXLabel(e.target.value)}
          onBlur={handleBlurX}
        />
        <TextField
          label="Y Axis Label"
          fullWidth
          margin="dense"
          value={localYLabel}
          onChange={(e) => setLocalYLabel(e.target.value)}
          onBlur={handleBlurY}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.areLabelsVisible}
              onChange={handleToggleLabels}
            />
          }
          label="Show axis labels"
        />
        <FormControlLabel
          control={
            <Checkbox checked={state.showGrids} onChange={handleToggleGrids} />
          }
          label="Show grid lines"
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default AxesAndGridsAccordion;
