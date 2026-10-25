import "dotenv/config";
import express from "express";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test endpoint
app.get("/health", (req, res) => {
  res.send("ok");
});

// Serve the React production build
app.use(express.static(path.join(import.meta.dirname, "../client/dist")));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});