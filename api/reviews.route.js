import express from "express";
import ReviewsController from "./reviews.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(400).json({ error: "movie id is required" });
});
router.route("/movie/:id").get(ReviewsController.apiGetReviews);
router.route("/new").post(requireAuth, ReviewsController.apiPostReview);
router
  .route("/:id")
  .get(ReviewsController.apiGetReviews)
  .put(requireAuth, ReviewsController.apiUpdateReview)
  .delete(requireAuth, ReviewsController.apiDeleteReview);

export default router;
