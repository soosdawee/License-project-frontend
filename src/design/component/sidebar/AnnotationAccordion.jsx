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
import {
  setShowAnnotations,
  setCustomAnnotation,
} from "../state/context/actions";

const AnnotationAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [localAnnotation, setLocalAnnotation] = useState(
    state.customAnnotation
  );

  const handleCheckboxChange = (e) => {
    dispatch(setShowAnnotations(e.target.checked));
  };

  const handleLocalChange = (e) => {
    setLocalAnnotation(e.target.value);
  };

  const handleBlur = () => {
    if (localAnnotation !== state.customAnnotation) {
      dispatch(setCustomAnnotation(localAnnotation));
    }
  };

  return (
    <Accordion disableGutters sx={{ borderBottom: "1px solid #e0dcdc" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Annotations</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.showAnnotations}
              onChange={handleCheckboxChange}
              sx={{
                color: "#007393",
                "&.Mui-checked": {
                  color: "#007393",
                },
              }}
            />
          }
          label="Show annotations"
        />
        {state.showAnnotations && (
          <TextField
            label="Annotation Format"
            fullWidth
            margin="normal"
            value={localAnnotation}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="e.g. {name}: {value} ({note})"
            sx={{
              "& label.Mui-focused": {
                color: "#007393",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#007393",
                },
              },
            }}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default AnnotationAccordion;
