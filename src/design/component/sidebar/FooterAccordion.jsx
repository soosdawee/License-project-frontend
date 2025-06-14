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
import { setIsFooter, setFooterText } from "../state/context/actions";

const FooterAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [localFooterText, setLocalFooterText] = useState(
    state.footerText || "Source: "
  );

  const handleCheckboxChange = (e) => {
    dispatch(setIsFooter(e.target.checked));
  };

  const handleLocalChange = (e) => {
    setLocalFooterText(e.target.value);
  };

  const handleBlur = () => {
    console.log(localFooterText !== state.footerText);
    if (localFooterText !== state.footerText) {
      dispatch(setFooterText(localFooterText));
    }
  };

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Footer</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.isFooter}
              onChange={handleCheckboxChange}
            />
          }
          label="Show footer"
        />
        {state.isFooter && (
          <TextField
            label="Footer Text"
            fullWidth
            margin="normal"
            value={localFooterText}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="e.g. Source"
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default FooterAccordion;
