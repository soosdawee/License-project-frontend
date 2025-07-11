import { useContext } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { setShowLegend } from "../state/context/actions";

const LegendAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);

  const handleCheckboxChange = (e) => {
    dispatch(setShowLegend(e.target.checked));
  };

  return (
    <Accordion disableGutters sx={{ borderBottom: "1px solid #e0dcdc" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Legend</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6%",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={state.showLegend}
              onChange={handleCheckboxChange}
            />
          }
          label="Show Legend"
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default LegendAccordion;
