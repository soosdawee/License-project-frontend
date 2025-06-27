import {
  Box,
  Stack,
  Divider,
  Typography,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import Navbar from "../component/Navbar";
import backend from "../../data-access/Backend";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get(
          `user/${localStorage.getItem("userId")}`
        );
        setUser(result.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    await backend.put("user/delete");
    navigate("/");
  };

  const getInitials = () => {
    if (!user.firstname || !user.lastname) return "";
    return (
      user.firstname.charAt(0).toUpperCase() +
      user.lastname.charAt(0).toUpperCase()
    );
  };

  const getAvatarSrc = () => {
    if (!user.profilePicture) return null;
    return `data:image/png;base64,${user.profilePicture}`;
  };

  const handleFirstname = (value) => {
    setUser((prevUser) => ({
      ...prevUser,
      firstname: value,
    }));
  };

  const handleLastname = (value) => {
    setUser((prevUser) => ({
      ...prevUser,
      lastname: value,
    }));
  };

  const handleDescription = (value) => {
    setUser((prevUser) => ({
      ...prevUser,
      description: value,
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.put(
        "http://localhost:8080/user/profile_picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await backend.get(
        `user/${localStorage.getItem("userId")}`
      );
      setUser(result.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleModifications = async () => {
    setEditingProfile(!editingProfile);
    if (editingProfile) {
      await backend.put("user", {
        firstname: user.firstname,
        lastname: user.lastname,
        description: user.description,
      });
    }
  };

  const handlePasswordChange = async () => {
    setChangingPassword(!changingPassword);
    if (changingPassword) {
      await backend.put("user/password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
        newPasswordRepeated: confirmPassword,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      {user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            height: "calc(100vh - 64px)",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Box
            sx={{
              width: "80%",
              height: "95%",
              backgroundColor: "white",
              borderRadius: "5px",
              border: "2px solid #001f47",
              display: "flex",
              flexDirection: "column",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyItems: "start",
                alignItems: "start",
                width: "94%",
              }}
            >
              <Typography
                sx={{
                  color: "#001f47",
                  fontWeight: "bold",
                  fontSize: "2.5rem",
                  marginBottom: "2%",
                }}
              >
                Settings
              </Typography>
            </Box>
            <Box
              sx={{
                width: "90%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  width: "48%",
                  height: "95%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #a8a8a8",
                  borderRadius: "5px",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" sx={{ margin: "2% 0" }}>
                  Edit Profile
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={getAvatarSrc()}
                    sx={{
                      width: 130,
                      height: 130,
                      margin: "2%",
                      fontSize: "4rem",
                    }}
                  >
                    {!user.profilePicture && getInitials()}
                  </Avatar>
                </Box>

                <TextField
                  label="First Name"
                  value={user.firstname}
                  onChange={(e) => handleFirstname(e.target.value)}
                  disabled={!editingProfile}
                  sx={{ margin: "0 2%", ...textSx }}
                />
                <TextField
                  label="Last Name"
                  value={user.lastname}
                  onChange={(e) => handleLastname(e.target.value)}
                  disabled={!editingProfile}
                  sx={{ margin: "2%", ...textSx }}
                />
                <TextField
                  label="Profile Description"
                  value={user.description}
                  onChange={(e) => handleDescription(e.target.value)}
                  disabled={!editingProfile}
                  sx={{ margin: "0 2%", ...textSx }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    color: "white",
                    backgroundColor: "#007393",
                    margin: "0 2%",
                    textTransform: "none",
                    outlineColor: "#007fa7",
                  }}
                >
                  Upload Profile Picture
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleModifications}
                  sx={{
                    color: "#001f47",
                    borderColor: "#001f47",
                    margin: "2%",
                    textTransform: "none",
                    outlineColor: "#007fa7",
                  }}
                >
                  {editingProfile ? "Save" : "Change"}
                </Button>
              </Box>
              <Box
                sx={{
                  width: "48%",
                  height: "95%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "70%",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #a8a8a8",
                    borderRadius: "5px",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" sx={{ margin: "2% 0" }}>
                    Change Password
                  </Typography>
                  <TextField
                    label="Old Password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={!changingPassword}
                    sx={{ margin: "0 2%", ...textSx }}
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!changingPassword}
                    sx={{ margin: "0 2%", ...textSx }}
                  />
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!changingPassword}
                    sx={{ margin: "0 2%", ...textSx }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handlePasswordChange}
                    sx={{
                      color: "#001f47",
                      borderColor: "#001f47",
                      margin: "2%",
                      textTransform: "none",
                      outlineColor: "#007fa7",
                    }}
                  >
                    {changingPassword ? "Save" : "Change"}
                  </Button>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    height: "20%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ textTransform: "none" }}
                    onClick={handleDelete}
                  >
                    Delete Profile
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SettingsPage;
