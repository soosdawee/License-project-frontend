import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { useContext, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { setTextColor, setFont } from "../state/context/actions";

const webSafeFonts = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
];

const TextColorAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [color, setColor] = useState(state.textColor || "#000000");
  const [localFont, setLocalFont] = useState(state.font || "Arial");

  const commitColorChange = () => {
    dispatch(setTextColor(color));
  };

  const handleFontChange = (e) => {
    setLocalFont(e.target.value);
  };

  const handleBlurFont = () => {
    if (localFont !== state.font) {
      dispatch(setFont(localFont));
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Text</Typography>
      </AccordionSummary>
      <AccordionDetails
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div onMouseUp={commitColorChange}>
          <HexColorPicker color={color} onChange={setColor} />
          <HexColorInput
            color={color}
            onChange={setColor}
            style={{ marginTop: "8px" }}
            onBlur={commitColorChange}
          />
        </div>
        <TextField
          select
          label="Font"
          value={localFont}
          onChange={handleFontChange}
          onBlur={handleBlurFont}
          fullWidth
        >
          {webSafeFonts.map((font) => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </MenuItem>
          ))}
        </TextField>
      </AccordionDetails>
    </Accordion>
  );
};

export default TextColorAccordion;
