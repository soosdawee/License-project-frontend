import { useContext, useState, useCallback, useEffect, Suspense } from "react";
import TableComponent from "../../table/TableComponent";
import {
  Button,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
} from "@mui/material";
import { VisualizationContext } from "../context/VisualizationContext";
import { setData, setSheetsLink } from "../context/actions";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const DataState = ({ visualizationModel, setState }) => {
  const { state, dispatch } = useContext(VisualizationContext);
  const [inputMethod, setInputMethod] = useState("manual");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [googleSheetURL, setGoogleSheetURL] = useState(state.sheetsLink);

  useEffect(() => {
    if (
      state.sheetsLink !== null &&
      state.sheetsLink !== "" &&
      state.sheetsLink !== undefined
    ) {
      setInputMethod("link");
      console.log(state.sheetsLink);
      handleLoadGoogleSheet();
    }
  }, [state.sheetsLink]);

  const fetchGoogleSheetData = async () => {
    try {
      const url = new URL(
        googleSheetURL.length == 0 ? state.sheetsLink : googleSheetURL
      );
      const subparts = url.pathname.split("/");
      const identifier = subparts[3];
      const gidMatch = url.hash.match(/gid=(\d+)/);
      const gid = gidMatch ? gidMatch[1] : "0";

      const csvUrl = `https://docs.google.com/spreadsheets/d/${identifier}/export?format=csv&gid=${gid}`;

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch Google Sheet");
      }

      const csvText = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          complete: (res) => {
            const cleaned = res.data.filter((row) =>
              row.some((cell) => cell !== "")
            );
            resolve(cleaned);
          },
          error: (err) => reject(err),
        });
      });
    } catch (err) {
      console.error(err);
      alert("Error loading Google Sheet");
      return null;
    }
  };

  const handleLoadGoogleSheet = async () => {
    const data = await fetchGoogleSheetData(googleSheetURL);
    if (data) {
      dispatch(setData(data));
      dispatch(setSheetsLink(googleSheetURL));
    }
  };

  const handleFileUpload = (file) => {
    if (!file) {
      return;
    }

    setUploadedFileName(file.name);

    const fileReader = new FileReader();
    const extension = file.name.split(".").pop().toLowerCase();

    if (extension === "xlsx" || extension === "xls") {
      fileReader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const project = XLSX.read(data, { type: "array" });
        const sheetName = project.SheetNames[0];
        const table = project.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(table, { header: 1 });
        const cleaned = jsonData.filter((row) =>
          row.some((cell) => cell !== "" && cell !== null)
        );
        dispatch(setData(cleaned));
      };
      fileReader.readAsArrayBuffer(file);
    } else if (extension === "csv") {
      Papa.parse(file, {
        complete: (results) => {
          const data = results.data.filter((row) =>
            row.some((cell) => cell !== "")
          );
          dispatch(setData(data));
        },
      });
    } else {
      alert("Please upload a CSV or Excel file.");
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleOnDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    dispatch(setSheetsLink(""));
    dispatch(setData([[], [], []]));
    handleFileUpload(file);
  };

  const fileInputRef = useCallback((node) => {
    if (node !== null) {
      node.value = null;
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: "0 3%",
      }}
    >
      <Box
        sx={{ display: "flex", width: "100%", height: "100%", minHeight: 0 }}
      >
        <Box
          sx={{
            height: "100%",
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pr: "1%",
          }}
        >
          <Suspense fallback={<div></div>}>
            <TableComponent
              visualizationModel={visualizationModel}
              isFirst={true}
              sx={{ width: "100%", height: "100%", flexGrow: 1 }}
            />
          </Suspense>

          {state.vizType === "ELECTION_RESULT" && (
            <Suspense fallback={<div></div>}>
              <TableComponent
                visualizationModel={visualizationModel}
                isFirst={false}
                sx={{ width: "100%", height: "100%", flexGrow: 1 }}
              />
            </Suspense>
          )}
        </Box>

        <Box
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <ToggleButtonGroup
              value={inputMethod}
              exclusive
              onChange={(e, val) => val && setInputMethod(val)}
              fullWidth
              color="primary"
              sx={{
                mb: 2,
                color: "black",
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
              <ToggleButton value="manual">Input data manually</ToggleButton>
              <ToggleButton value="upload">Upload From Excel</ToggleButton>
              <ToggleButton name="google-sheets" value="link">
                Link Google Sheets
              </ToggleButton>
            </ToggleButtonGroup>

            {inputMethod === "manual" && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ color: "#001318" }}
              >
                You can manually input or modify data directly in the table.
              </Typography>
            )}

            {inputMethod === "upload" && (
              <>
                <Box
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleOnDrop}
                  onClick={() => document.getElementById("file-upload").click()}
                  sx={{
                    width: "100%",
                    minHeight: 150,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    bgcolor: dragOver ? "#e3f2fd" : "transparent",
                    transition: "background-color 0.3s ease",
                    textAlign: "center",
                    userSelect: "none",
                    color: "#007393",
                    margin: "0 10% 0 10%",
                  }}
                >
                  <Typography>
                    Drag and drop a CSV or Excel file <br></br>here, or click to
                    select a file
                  </Typography>
                </Box>

                {uploadedFileName && (
                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 1, textAlign: "center", color: "#007393" }}
                  >
                    Uploaded file: {uploadedFileName}
                  </Typography>
                )}

                <input
                  id="file-upload"
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleInputChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
              </>
            )}

            {inputMethod === "link" && (
              <Box sx={{ width: "100%" }}>
                <TextField
                  name="sheets-link"
                  fullWidth
                  label="Google Sheets URL"
                  variant="outlined"
                  value={googleSheetURL}
                  onChange={(e) => setGoogleSheetURL(e.target.value)}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#007fa7",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#007fa7",
                    },
                  }}
                />
                <Button
                  name="load-data"
                  onClick={handleLoadGoogleSheet}
                  variant="outlined"
                  sx={{
                    mt: 1,
                    outlineColor: "#007fa7",
                    border: "1px solid #007fa7",
                    color: "#007fa7",
                    width: "35%",
                    height: "auto",
                  }}
                >
                  Load Data
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ alignSelf: "flex-end", mb: "16%" }}>
            <Button
              variant="contained"
              onClick={() => setState("Customize Visualization")}
              sx={{
                backgroundColor: "#007fa7",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#007393",
                  boxShadow: "none",
                },
              }}
            >
              Proceed
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DataState;
