import "dotenv/config";
import express from "express";
import path from "node:path";
import { searchImages } from "./openverse.js";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/query/:search", async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);

  if (!Number.isInteger(page) || page < 1 || page > 12) {
    return res.status(400).json({
      error: "page must be a whole number from 1 to 12",
    });
  }

  try {
    const term = req.params.search.trim().toLowerCase();

    if (page === 1) {
      await pool.query(
        "INSERT INTO searches (term) VALUES ($1)",
        [term]
      );
    }

    const images = await searchImages(term, page);

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