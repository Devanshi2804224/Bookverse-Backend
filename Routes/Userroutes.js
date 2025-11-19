import express from "express";
import User from "../Models/Usermodels.js";
import { sendOTP, resetPassword } from "../Controller/Usercontroller.js";

const router = express.Router();

/* ---------------------- REGISTER ---------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------- LOGIN ---------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------------- OTP ---------------------- */
router.post("/send-otp", sendOTP);
router.post("/reset-password", resetPassword);

/* ---------------------- GET ALL USERS ---------------------- */
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "_id name email role isActive createdAt");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ success: false, message: "Server error fetching users" });
  }
});

/* ---------------------- UPDATE USER ---------------------- */
router.put("/:id", async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      isActive: req.body.isActive,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ success: false, message: "Server error updating user" });
  }
});

/* ---------------------- DELETE USER ---------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Server error deleting user" });
  }
});

export default router;
