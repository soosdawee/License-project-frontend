import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import backend from "../../data-access/Backend";
import { useEffect, useState } from "react";

const ProfileComponent = ({ user, viewMode, setViewMode, id }) => {
  const [isFriend, setIsFriend] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fri = await backend.get(`friend_request/${id}/are_we_friends`);
        setIsFriend(fri.data.currentStatus);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, [id]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSendFriendRequest = async () => {
    try {
      await backend.post(`friend_request/${id}`);
      handleClose();
    } catch (err) {
      console.error("Failed to send friend request", err);
    }
  };

  console.log(isFriend);

  return (
    <>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "2rem",
          color: "#001f47",
          width: "50%",
          height: "15%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        {user?.firstname} {user?.lastname}
        {!isFriend && (
          <>
            <IconButton size="small" onClick={handleMenuClick} sx={{ ml: 1 }}>
              <ArrowDropDownIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleSendFriendRequest}>
                Send a friend request
              </MenuItem>
            </Menu>
          </>
        )}
      </Typography>

      <Typography
        sx={{
          fontSize: "1rem",
          color: "#757575",
          width: "50%",
          height: "40px",
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          justifyContent: "start",
        }}
      >
        {user?.description}
      </Typography>

      <Box
        sx={{
          width: "50%",
          height: "10px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, val) => val && setViewMode(val)}
          color="primary"
          sx={{
            width: "75%",
            height: "100%",
            color: "black",
            backgroundColor: "white",
            "& .MuiToggleButton-root": {
              "&.Mui-selected": {
                backgroundColor: "#007fa7",
                color: "white",
                "&:hover": {
                  backgroundColor: "#007393",
                },
              },
            },
          }}
        >
          <ToggleButton value="visualizations" sx={{ width: "33.3%" }}>
            Visualizations
          </ToggleButton>
          <ToggleButton value="liked" sx={{ width: "33.3%" }}>
            Liked posts
          </ToggleButton>
          <ToggleButton value="friends" sx={{ width: "33.3%" }}>
            Friends
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </>
  );
};

export default ProfileComponent;
