import AuthDAO from "../dao/authDAO.js";

export async function requireAuth(req, res, next) {
  try {
    const user = await AuthDAO.getUserBySession(req.cookies.session);
    if (!user) {
      res.status(401).json({ error: "authentication required" });
      return;
    }
    req.user = {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    };
    next();
  } catch (error) {
    next(error);
  }
}

export async function loadAuth(req, res, next) {
  try {
    req.user = await AuthDAO.getUserBySession(req.cookies.session);
    next();
  } catch (error) {
    next(error);
  }
}
