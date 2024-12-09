const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000; // You can use any free port

// Enable CORS for your frontend
app.use(cors());

// Proxy endpoint to handle Wolfram Alpha API requests
app.get("/api/wolfram", async (req, res) => {
  const query = req.query.input; // The input value from the frontend
  const appId = "L4VE6K-3KQG8WXLTR"; // Replace with your actual App ID securely
  const url = `https://api.wolframalpha.com/v2/query?appid=${appId}&input=${encodeURIComponent(
    query
  )}&output=XML`;

  try {
    // Fetch data from Wolfram Alpha API
    const response = await axios.get(url);
    res.send(response.data); // Send the data back to the frontend
  } catch (error) {
    console.error("Error in Proxy:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
