import express from "express";
import AuthController from "./auth.controller.js";
import { loadAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", loadAuth, AuthController.me);

export default router;
