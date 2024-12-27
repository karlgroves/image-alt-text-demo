const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = 8000;

// OpenAI Configuration
const openai = new OpenAI();

// Configure Multer for image uploads
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Upload and analyze image endpoint
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Convert the image to base64
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

    // Use OpenAI's Vision capabilities to analyze the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Adjust to the available model in your account
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Generate clear, concise, and detailed alternative text for this image" },
            { type: "image_url", image_url: { url: base64Image, detail: "low" } },
          ],
        },
      ],
      max_tokens: 300,
    });

    // Extract the description from the response
    const description = response.choices[0]?.message?.content || "No description available.";

    // Respond with the generated description and metadata
    res.json({
      description,
      fileName: req.file.originalname,
      imagePath: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);

    // Respond with detailed error message
    res.status(500).json({
      error: true,
      message: error.response?.data?.error?.message || "An unexpected error occurred",
    });
  }
});

// Save endpoint
app.post("/save", (req, res) => {
    try {
      const { altText, fileName } = req.body;
  
      // Validate request body
      if (!altText || !fileName) {
        console.error("Invalid data received:", req.body);
        return res.status(400).json({ error: "Missing altText or fileName in the request." });
      }
  
      // Simulate saving logic
      console.log("Saving data:", { altText, fileName });
  
      // Respond with success
      res.json({ message: "Data saved successfully!" });
    } catch (error) {
      console.error("Error in /save endpoint:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});