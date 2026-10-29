import express from "express";

const router = express.Router();
const tmdbBaseUrl = "https://api.themoviedb.org/3";

async function requestTmdb(path, params = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  const searchParams = new URLSearchParams({
    api_key: apiKey,
    ...params,
  });
  const response = await fetch(
    `${tmdbBaseUrl}${path}?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }

  return response.json();
}

router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const data = await requestTmdb("/discover/movie", {
      sort_by: "popularity.desc",
      page: String(Math.min(Math.max(page, 1), 500)),
    });
    res.json(data);
  } catch (error) {
    console.error("Unable to load movies:", error.message);
    res.status(502).json({ error: "Unable to load movies" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!query) {
      res.status(400).json({ error: "query is required" });
      return;
    }

    const data = await requestTmdb("/search/movie", { query });
    res.json(data);
  } catch (error) {
    console.error("Unable to search movies:", error.message);
    res.status(502).json({ error: "Unable to search movies" });
  }
});

export default router;
