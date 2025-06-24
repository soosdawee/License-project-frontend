import { useEffect, useState } from "react";
import backend from "../../data-access/Backend";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Divider,
} from "@mui/material";

const RequestComponent = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await backend.get("/friend_request");
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    console.log(requestId);
    console.log(action);
    try {
      await backend.put(`/friend_request/${requestId}`, {
        status: action,
      });
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } catch (error) {
      console.error(`Failed to ${action} request`, error);
    }
  };

  if (requests.length === 0) {
    return <Typography sx={{ p: 2 }}>No pending friend requests.</Typography>;
  }

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      {requests.map((req) => (
        <Card key={req.requestId}>
          <CardContent sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
                gap: "5%",
                padding: "2% 1% 2% 1%",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#001f47",
                  border: "1px solid #001F47",
                }}
              >
                {req.firstname[0].toUpperCase()}
                {req.lastname[0].toUpperCase()}
              </Avatar>
              <Typography variant="h6">
                {req.firstname} {req.lastname}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "5%",
                padding: "2% 1% 2% 1%",
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  width: "33.3%",
                  border: "1px solid black",
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  margin: "0 !important",
                  backgroundColor: "#007fa7",
                  color: "white",
                }}
                onClick={() => handleAction(req.requestId, "ACCEPTED")}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                sx={{
                  width: "33.3%",
                  border: "1px solid black",
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  margin: "0 !important",
                  backgroundColor: "#c62828",
                  color: "white",
                }}
                onClick={() => handleAction(req.requestId, "REJECTED")}
              >
                Reject
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default RequestComponent;
