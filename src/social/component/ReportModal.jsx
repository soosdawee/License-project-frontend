import { Box, Typography, Modal, Button, IconButton } from "@mui/material";
import backend from "../../data-access/Backend";
import CancelIcon from "@mui/icons-material/Cancel";

const ReportModal = ({ open, onClose, visualization }) => {
  const handleReport = async () => {
    await backend.put(`visualization/${visualization.visualizationId}/report`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: "15vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          backgroundColor: "#f8f4f4",
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#001F47",
            }}
          >
            Visualization of {visualization?.user.firstname}{" "}
            {visualization?.user.lastname}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#c12c2d" }}>
            <CancelIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
          }}
        >
          <Typography
            variant="h8"
            sx={{
              color: "#001F47",
            }}
          >
            Our fact-checkers will review meticulously the visualization!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#001f47", textTransform: "none" }}
              onClick={handleReport}
            >
              Report
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReportModal;
