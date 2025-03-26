import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
  const { username, fullName, email, password } = req.body;
  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new Error("All fields are required");
    return res.json({ message: "All fields are required", success: false });
  }
  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.json({ message: "User already exists", success: false });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      fullName,
      password: hashedPassword,
    });
    const createdUser = await User.findById(newUser._id).select(
      "-password -token"
    );

    res.json({
      data: createdUser,
      message: "User registered successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while registering the user",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.json({ success: false, message: "Invalid user credentials" });
    }

    const token = createToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -token"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.status(200).cookie("token", token, options).json({
      response: loggedInUser,
      token,
      message: "User logged In successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred during user logged In!",
    });
  }
};

export { loginUser, registerUser };
