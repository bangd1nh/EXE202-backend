export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = {
      id: decoded.userId, 
      role: decoded.role,
      email: decoded.usernameOrEmail
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
