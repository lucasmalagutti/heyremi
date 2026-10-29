import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import auth from "./api/auth.route.js";
import movies from "./api/movies.route.js";
import reviews from "./api/reviews.route.js";
import { parseCookies } from "./middleware/cookies.js";

const app = express();
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(parseCookies);
app.use(express.static(projectRoot));

app.use("/api/v1/auth", auth);
app.use("/api/v1/movies", movies);
app.use("/api/v1/reviews", reviews);
app.use((req, res) => res.status(404).json({ error: "not found" }));

export default app;
