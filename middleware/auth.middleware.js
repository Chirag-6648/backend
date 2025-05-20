import User from "../schema/user.schema.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer", "");
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. Token missing." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.userId).select("-password"); // Fixed: token payload field is likely `userId`, not `_id`

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid access token. User not found." });
    }

    req.user = user; // Attach user to request for use in next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ message: "Token is invalid or expired." });
  }
};
