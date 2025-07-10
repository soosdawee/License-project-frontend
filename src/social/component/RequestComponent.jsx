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
} from "@mui/material";
import friendsImage from "../../common/image/friends.svg";

const RequestComponent = ({ refreshKey, setRefreshKey }) => {
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
    try {
      await backend.put(`/friend_request/${requestId}`, {
        status: action,
      });
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      if (action === "ACCEPTED") {
        setRefreshKey(refreshKey + 1);
      }
    } catch (error) {
      console.error(`Failed to ${action} request`, error);
    }
  };

  if (requests.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          height: "100%",
          width: "80%",
        }}
      >
        <img
          src={friendsImage}
          alt="No friend requests"
          style={{ width: "200px", marginBottom: "20px" }}
        />
        <Typography variant="h6" color="textSecondary">
          No pending friend requests.
        </Typography>
      </Box>
    );
  }

  const getInitials = (user) => {
    if (!user) return null;
    if (!user.firstname || !user.lastname) return "";
    return (
      user.firstname.charAt(0).toUpperCase() +
      user.lastname.charAt(0).toUpperCase()
    );
  };

  const getAvatarSrc = (user) => {
    if (!user) return null;
    return `data:image/png;base64,${user.profilePicture}`;
  };

  return (
    <Stack
      spacing={2}
      sx={{ justifyContent: "start", alignItems: "center", width: "100%" }}
    >
      <Box
        sx={{
          width: "95%",
          backgroundColor: "#007fa7",
          margin: "1% 5%",
          borderRadius: "15px",
        }}
      >
        <Typography sx={{ color: "white" }}>Friend Requests</Typography>
      </Box>
      {requests.map((req) => (
        <Card key={req.requestId} sx={{ width: "90%" }}>
          <CardContent sx={{ width: "90%" }}>
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
                src={getAvatarSrc(req)}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {!req?.profilePicture && getInitials(req)}
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
