import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  console.log("Auth middleware running...");

  try {
    // Try cookies first
    const token = req.cookies.token 
      || req.headers.authorization?.split(" ")[1]; // fallback to headers

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found. Please login first."
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken; // attach user data to request
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message
    });
  }
};
