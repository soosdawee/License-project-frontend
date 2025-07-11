import { useEffect, useState } from "react";
import {
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
} from "@mui/material";
import backend from "../../data-access/Backend";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const UserComponent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await backend.get("user");
      return response.data;
    } catch (error) {
      console.log("Error fetching");
    }
  };

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      users?.filter(
        (user) =>
          user.firstname.toLowerCase().includes(term) ||
          user.lastname.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, users]);

  const handleProfileVisit = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleDelete = async (userId) => {
    try {
      await backend.delete(`user/${userId}`);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );
    } catch (error) {
      console.log("Unable to perform delete");
    }
  };

  const initialsOf = (user) => {
    if (!user.firstname || !user.lastname) {
      return "";
    } else {
      return (
        user.firstname.charAt(0).toUpperCase() +
        user.lastname.charAt(0).toUpperCase()
      );
    }
  };

  const profilePictureOf = (user) => {
    if (!user.profilePicture) {
      return null;
    } else {
      return `data:image/png;base64,${user.profilePicture}`;
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        name="search-bar"
        label="Search users"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
        fullWidth
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexWrap="nowrap"
        overflow="auto"
      >
        {filteredUsers?.map((user, index) => (
          <Box
            sx={{ width: "100%", color: "#007fa7" }}
            key={user.id}
            onClick={() => handleProfileVisit(user.userId)}
          >
            <Card
              name={`card-${index}`}
              sx={{
                "&:hover .show-on-hover": {
                  opacity: 1,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  width: "90%",
                  gap: 2,
                }}
              >
                <Avatar
                  src={profilePictureOf(user)}
                  sx={{
                    width: "5%",
                    height: "auto",
                    aspectRatio: "1",
                    bgcolor: "white",
                    color: "#001f47",
                    fontSize: "1rem",
                    border: "2px solid #001f47",
                  }}
                >
                  {!user.profilePicture && initialsOf(user)}
                </Avatar>

                <Typography
                  variant="h6"
                  sx={{ minWidth: 150, textAlign: "left" }}
                >
                  {user.firstname} {user.lastname}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ minWidth: 200, textAlign: "left" }}
                >
                  {user.email}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ minWidth: 100, textAlign: "left" }}
                >
                  {user.userType}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ minWidth: 150, textAlign: "left" }}
                >
                  {user.isActive ? "Active user" : "Has been deleted"}
                </Typography>

                <IconButton
                  name={`user-delete-${index}`}
                  className="show-on-hover"
                  sx={{
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    color: "red",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.userId);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default UserComponent;
