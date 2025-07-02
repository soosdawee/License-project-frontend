import { Box, Button, Typography } from "@mui/material";
import TransparentNavbar from "../component/TransparentNavbar";
import logo_a_lot from "../image/logo_a_lot.svg";
import LandinIllustration from "../image/landing_illustration.svg";
import charts from "../image/charts.svg";
import maps from "../image/maps.svg";
import icon1 from "../image/icon1.svg";
import icon2 from "../image/icon2.svg";
import icon3 from "../image/icon3.svg";
import icon4 from "../image/icon4.svg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Transparent Navbar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: "100%",
        }}
      >
        <TransparentNavbar />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "100vh", // full viewport height
          width: "100%",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${logo_a_lot})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.3,
            zIndex: 0,
          },
          background: "linear-gradient(to right, #001f47, rgb(32, 81, 134))",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12%",
          }}
        >
          <Box
            sx={{
              width: "65%",
              height: "30%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "start",
              gap: "0",
            }}
          >
            {["Data speaks,", "We visualize.", "Be a Storyteller!"].map(
              (line, index) => (
                <Typography
                  key={index}
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    fontSize: "3rem",
                    color: "white",
                    fontWeight: "bold",
                    letterSpacing: "0.15rem",
                  }}
                >
                  {line}
                </Typography>
              )
            )}
          </Box>
          <Box
            sx={{
              width: "65%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: "#c82c2c",
                width: "50%",
                height: "50px",
                textTransform: "none",
              }}
              onClick={handleStart}
            >
              Start Creating
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <img
            src={LandinIllustration}
            alt="Landing Illustration"
            style={{
              width: "85%",
              height: "90%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      {/* Additional Scrollable Content */}
      <Box
        sx={{
          width: "100%",
          minHeight: "50vh",
          backgroundColor: "#001f47",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: "2rem 0",
        }}
      >
        {[
          {
            title: "Charts",
            image: charts,
            text: `Our charts turn raw data into compelling visual narratives, helping your readers uncover insights at a glance. With interactive features and customizable designs, every visualization adapts to your story.`,
          },
          {
            title: "Maps",
            image: maps,
            text: `Our maps transform geographic data into powerful visual stories, enabling your audience to explore spatial insights instantly. With interactive layers and flexible customization, each map aligns seamlessly with your narrative.`,
          },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              width: "45%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <Box
              sx={{
                width: "35%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "white",
                  textAlign: "left",
                }}
              >
                {item.text}
              </Typography>
            </Box>
            <Box sx={{ width: "65%" }}>
              <img
                src={item.image}
                alt={`${item.title} Illustration`}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "50vh",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
          padding: "2% 0",
        }}
      >
        <Box sx={{ width: "80%", height: "40%" }}>
          <Typography
            color="secondary"
            sx={{
              textAlign: "left",
              width: "100%",
              color: "#001f47",
              fontWeight: "bold",
              fontSize: "2.5rem",
            }}
          >
            Explore our features
          </Typography>
          <Typography
            color="secondary"
            sx={{
              textAlign: "left",
              width: "100%",
              color: "#001f47",
              fontSize: "1.5rem",
            }}
          >
            You can can find anything you need to create stunning visualizations
            for your articles, reports, and publications.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "80%",
            height: "60%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {[icon1, icon2, icon3, icon4].map((icon, index) => {
            const titles = [
              "Unlimited Visualizations",
              "Private by default",
              "Responsive",
              "Live updating",
            ];
            const descriptions = [
              "You have the possibility to create unlimited number of charts and maps, without the need to pay for a plan.",
              "For us privacy is key. All your visualizations and data are private until the moment you hit the “Publish” button.",
              "No matter what device you use, our visualizations remain clear and easy to read.",
              "Create visualizations that update themselves periodically. Simply link to an external CSV. Learn more.",
            ];

            return (
              <Box
                key={index}
                sx={{
                  width: "25%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  textAlign: "left",
                  gap: 2,
                }}
              >
                <img
                  src={icon}
                  alt={`Feature icon ${index + 1}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    color: "#001f47",
                    fontWeight: "bold",
                  }}
                >
                  {titles[index]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#001f47",
                  }}
                >
                  {descriptions[index]}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
