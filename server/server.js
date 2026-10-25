import "dotenv/config";
import express from "express";
import path from "node:path";
import { searchImages } from "./openverse.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/query/:search", async (req, res) => {
  try {
    const term = req.params.search;

    const images = await searchImages(term, 1);

    res.json(images);
  } catch (error) {
    console.error("Image search failed:", error);
    res.status(502).json({ error: "Image service error" });
  }
});

app.use(express.static(path.join(import.meta.dirname, "../client/dist")));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});