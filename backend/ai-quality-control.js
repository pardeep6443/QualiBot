const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const app = express();
app.use(cors());

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Handle image upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = path.resolve(req.file.path);
    console.log("Uploaded image path:", imagePath);

    // Prepare form-data for file upload
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    // Send the image file to Flask server
    const response = await axios.post("http://127.0.0.1:5001/process-image", formData, {
      headers: {
        ...formData.getHeaders(),  // Include form-data headers
      },
    });

    // Send Flask response to the client
    res.json({ message: "Image processed successfully", ...response.data });

    // Optionally, delete the uploaded file after processing
    fs.unlinkSync(imagePath);

  } catch (error) {
    console.error("Error processing image:", error.message);
    res.status(500).json({ message: "Error processing image", error: error.message });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});