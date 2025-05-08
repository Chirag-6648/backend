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

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).cookie("token", token).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

export { registerUser, loginUser };
