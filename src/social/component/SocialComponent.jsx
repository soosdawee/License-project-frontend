import { useEffect, useState, useRef } from "react";
import backend from "../../data-access/Backend";
import { Stack } from "@mui/material";
import PostComponent from "./PostComponent";

const SocialComponent = () => {
  const [vizList, setVizList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get("visualization/shared");
        setVizList(result.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Stack spacing={3} sx={{ p: "2% 5%", overflow: "auto" }}>
        {vizList.map((viz, index) => (
          <PostComponent
            visualization={viz}
            setVizList={setVizList}
            index={index}
          />
        ))}
      </Stack>
    </>
  );
};

export default SocialComponent;
