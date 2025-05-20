import User from "../schema/user.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookieparser";

const registerUser = async (req, res) => {
  try {
    const { name, email, gender, password } = req.body;

    if ([name, email, gender, password].some((field) => !field?.trim())) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with email already registered" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      gender,
      password: encryptedPassword,
    });

    await user.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    console.error("Error in registering user", error);
    return res
      .status(500)
      .json({ message: "Error in registering user", error });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Sanitize user before sending response
    const loggedInUser = await User.findById(user._id).select("-password");

    // 6. Send response with cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({
        message: "Login successful",
        user: loggedInUser,
        token,
      });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

const getCurrentUser = async (req, res) => {
  return res
    .status(200)
    .json({ message: "current user fetched successfully", user: req.user });
};

export { registerUser, loginUser, getCurrentUser };
