import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, "SECRET123");
    req.user = decoded;
    next();
  } catch {
    return res.sendStatus(403);
  }
};

