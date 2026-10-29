import AuthDAO from "../dao/authDAO.js";
import { clearCookie, setCookie } from "../middleware/cookies.js";

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function validateCredentials(body) {
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";
  const displayName =
    typeof body.displayName === "string" ? body.displayName.trim() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "valid email is required" };
  }
  if (password.length < 8 || password.length > 128) {
    return { error: "password must contain 8 to 128 characters" };
  }
  return { email, password, displayName };
}

export default class AuthController {
  static async register(req, res) {
    const credentials = validateCredentials(req.body);
    if (credentials.error || !credentials.displayName) {
      res.status(400).json({
        error: credentials.error || "displayName is required",
      });
      return;
    }

    try {
      const user = await AuthDAO.createUser(
        credentials.email,
        credentials.password,
        credentials.displayName,
      );
      const token = await AuthDAO.createSession(user.id);
      setCookie(res, "session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.status(201).json({ user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ error: "email is already registered" });
        return;
      }
      console.error("Unable to register user:", error.message);
      res.status(500).json({ error: "Unable to register user" });
    }
  }

  static async login(req, res) {
    const credentials = validateCredentials(req.body);
    if (credentials.error) {
      res.status(400).json({ error: credentials.error });
      return;
    }

    try {
      const user = await AuthDAO.verifyCredentials(
        credentials.email,
        credentials.password,
      );
      if (!user) {
        res.status(401).json({ error: "invalid credentials" });
        return;
      }
      const token = await AuthDAO.createSession(user.id);
      setCookie(res, "session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.json({ user });
    } catch (error) {
      console.error("Unable to log in user:", error.message);
      res.status(500).json({ error: "Unable to log in user" });
    }
  }

  static async logout(req, res) {
    await AuthDAO.deleteSession(req.cookies.session);
    clearCookie(res, "session");
    res.status(204).send();
  }

  static async me(req, res) {
    res.json({ user: req.user });
  }
}
