const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Paths
const DATA_FILE = path.join(__dirname, "data.json");
const FRONTEND_DIR = path.join(__dirname, "../frontend");

// Load + Save helpers
function loadData() {
  if (!fs.existsSync(DATA_FILE)) return { favorites: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API routes
app.get("/favorites", (req, res) => {
  res.json(loadData().favorites);
});

app.post("/favorites", (req, res) => {
  let data = loadData();
  data.favorites.push(req.body);
  saveData(data);
  res.json({ status: "saved" });
});

// Serve frontend
app.use(express.static(FRONTEND_DIR));

// Fallback (serve index.html for root)
app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
