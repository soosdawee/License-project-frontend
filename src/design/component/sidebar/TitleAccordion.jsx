import { useContext, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Stack,
  MenuItem,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  setTitle,
  setTitleSize,
  setArticleSize,
  setFont,
  setArticle,
} from "../state/context/actions";
import { VisualizationContext } from "../state/context/VisualizationContext";

const TitleAccordion = () => {
  const { state, dispatch } = useContext(VisualizationContext);

  const [localTitle, setLocalTitle] = useState(state.title);
  const [localArticle, setLocalArticle] = useState(state.article || "");
  const [localTitleFontSize, setLocalTitleFontSize] = useState(
    state.titleSize || 40
  );
  const [localArticleFontSize, setLocalArticleFontSize] = useState(
    state.articleSize || 16
  );

  const handleBlurTitle = () => {
    if (localTitle !== state.title) {
      dispatch(setTitle(localTitle));
    }
  };

  const handleBlurArticle = () => {
    if (localArticle !== state.article) {
      dispatch(setArticle(localArticle));
    }
  };

  const handleBlurTitleFontSize = () => {
    const size = Number(localTitleFontSize);
    if (
      !isNaN(size) &&
      size > 0 &&
      size <= 100 &&
      size !== state.titleFontSize
    ) {
      dispatch(setTitleSize(size));
    } else {
      setLocalTitleFontSize(state.titleFontSize || 40);
    }
  };

  const handleBlurArticleFontSize = () => {
    const size = Number(localArticleFontSize);
    if (
      !isNaN(size) &&
      size > 0 &&
      size <= 100 &&
      size !== state.articleFontSize
    ) {
      dispatch(setArticleSize(size));
    } else {
      setLocalArticleFontSize(state.articleFontSize || 16);
    }
  };

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Header</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            fullWidth
            onBlur={handleBlurTitle}
          />
          <TextField
            label="Article"
            value={localArticle}
            onChange={(e) => setLocalArticle(e.target.value)}
            fullWidth
            onBlur={handleBlurArticle}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Title Font Size (px)"
              type="number"
              value={localTitleFontSize}
              onChange={(e) => setLocalTitleFontSize(e.target.value)}
              onBlur={handleBlurTitleFontSize}
              inputProps={{ min: 8, max: 100 }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Article Font Size (px)"
              type="number"
              value={localArticleFontSize}
              onChange={(e) => setLocalArticleFontSize(e.target.value)}
              onBlur={handleBlurArticleFontSize}
              inputProps={{ min: 8, max: 100 }}
              sx={{ flex: 1 }}
            />
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default TitleAccordion;
