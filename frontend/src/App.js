import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, CircularProgress, Alert } from "@mui/material";

function App() {
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setAltText(""); // Clear previous alt text
    setLoading(false); // Reset loading state
    setSuccessMessage(""); // Reset success message
  };

  // Handle file upload and analysis
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true); 

    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { description } = response.data;
      setAltText(description); // Set the generated alt text
      setLoading(false); // Hide loader
    } catch (error) {
      console.error("Error analyzing the image:", error.response?.data || error.message);
      alert(`Failed to analyze the image: ${error.response?.data?.message || "Unknown error"}`);
      setLoading(false); // Hide loader in case of error
    }
  };

  // Handle saving the image and alt text
  const handleSave = async () => {
    try {
      const payload = { altText, fileName: file?.name || "unknown" }; // Safeguard fileName
      await axios.post("http://localhost:8000/save", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Show success message
      setSuccessMessage("Image and Text Alternative saved successfully!");
    } catch (error) {
      console.error("Error saving the data:", error.response?.data || error.message);
      alert(
        `Failed to save: ${error.response?.data?.message || error.response?.data || "Unknown error"}`
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Image Alt Text Generator
      </Typography>

      {/* Show success alert if save was successful */}
      {successMessage ? (
        <Alert severity="success" sx={{ mt: 3 }}>
          {successMessage}
        </Alert>
      ) : (
        <>
          {/* Upload Image Button */}
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            
          </Button>

          {/* Image Preview */}
          {previewUrl && (
            <Box
              sx={{
                mt: 3,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Image Preview:
              </Typography>
              <img
                src={previewUrl}
                alt="Selected file preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  border: "1px solid #ccc",
                  marginTop: "10px",
                }}
              />
            </Box>
          )}

          {/* Generate Alt Text Button */}
          {previewUrl && !altText && (
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Processing..." : "Generate Alt Text"}
            </Button>
          )}

          {/* Loader */}
          {loading && (
            <Box sx={{ mt: 3 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Analyzing image...</Typography>
            </Box>
          )}

          {/* Text Alternative Input and Save Button */}
          {altText && (
            <>
              <TextField
                label="Text Alternative"
                multiline
                rows={4}
                fullWidth
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                helperText="Suggested Alt Text"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ mt: 3 }}
              />
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ mt: 3 }}
              >
                Save
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default App;