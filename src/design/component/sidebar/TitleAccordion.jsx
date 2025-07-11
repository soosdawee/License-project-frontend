import { useContext, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Stack,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  setTitle,
  setTitleSize,
  setArticleSize,
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
    if (!isNaN(size) && size > 0 && size <= 100 && size !== state.titleSize) {
      dispatch(setTitleSize(size));
    } else {
      setLocalTitleFontSize(state.titleSize || 40);
    }
  };

  const handleBlurArticleFontSize = () => {
    const size = Number(localArticleFontSize);
    if (!isNaN(size) && size > 0 && size <= 100 && size !== state.articleSize) {
      dispatch(setArticleSize(size));
    } else {
      setLocalArticleFontSize(state.articleSize || 16);
    }
  };

  const textSx = {
    "& label.Mui-focused": {
      color: "#007393",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#007393",
      },
    },
  };

  return (
    <Accordion
      disableGutters
      sx={{ borderBottom: "1px solid #e0dcdc", borderTop: "1px solid #e0dcdc" }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Header</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField
            name="title"
            label="Title"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            fullWidth
            onBlur={handleBlurTitle}
            sx={textSx}
          />
          <TextField
            name="article"
            label="Article"
            value={localArticle}
            onChange={(e) => setLocalArticle(e.target.value)}
            fullWidth
            onBlur={handleBlurArticle}
            sx={textSx}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              name="title-font"
              label="Title Font Size (px)"
              type="number"
              value={localTitleFontSize}
              onChange={(e) => setLocalTitleFontSize(e.target.value)}
              onBlur={handleBlurTitleFontSize}
              inputProps={{ min: 8, max: 100 }}
              sx={{ flex: 1, ...textSx }}
            />
            <TextField
              name="article-font"
              label="Article Font Size (px)"
              type="number"
              value={localArticleFontSize}
              onChange={(e) => setLocalArticleFontSize(e.target.value)}
              onBlur={handleBlurArticleFontSize}
              inputProps={{ min: 8, max: 100 }}
              sx={{ flex: 1, ...textSx }}
            />
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default TitleAccordion;
