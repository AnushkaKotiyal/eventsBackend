const User = require("../Models/Users");
const OTP_Log=require('../Models/OtpLog');
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
require('dotenv').config();
const cookie=require('cookies');

//login
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, dob, phone, photo_url } = req.body;

    if (!name || !email || !password || !address || !dob || !phone) {
      return res.status(400).json({
        success: false,
        message: "Fill all the Mandatory Fields",
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // ✅ Check if email is verified in OTP_Log
    const otpVerified = await OTP_Log.findOne({
      where: {
        email,
        verified: true
      },
      order: [['created_at', 'DESC']]
    });

    if (!otpVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before signing up"
      });
    }

    // ✅ Proceed with user creation
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      dob,
      phone,
      photo_url,
    });

    res.status(201).json({
      success: true,
      user,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "fill all the mandatory fields",
    });
  }
  const user = await User.findOne({ where: { email } });
  console.log(user);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Email not found",
    });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({
      success: false,
      message: "Incorrect password",
    });
  } else {
    const payload = {
      email: user.email,
      id: user.user_id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "5h",
    });
    user.password=undefined;
    const options={
        expires: new Date(Date.now()+3*24*60*60*1000),
        httpOnly:true,
    }
    res.cookie("token",token,options).status(200).json({
        success:true,
        user,
        token,
        message:"Logged in Successfully"
    })
  }
};
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { name, email, password, address, dob, phone, photo_url } = req.body;
    if (!name || !email || !password || !address || !dob || !phone) {
      return res.status(400).json({
        success: false,
        message: "Fill all the Mandatory Fields",
        error,
      });
    }
    const [updated] = await User.update(
      { name, email, password, address, dob, phone, photo_url },
      { where: { user_id: req.params.id } }
    );
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.status(200).json({
        success: true,
        user: updatedUser,
        message: "User Updated Successfully",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "User id required",
        error,
      });
    }
    const deleted = await User.destroy({ where: { user_id: req.params.id } });
    if (deleted) {
      res.status(204).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
