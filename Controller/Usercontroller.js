import User from "../Models/Usermodels.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

/* -------------------------------------------------------------------------- */
/* 🚀 SEND OTP                                                               */
/* -------------------------------------------------------------------------- */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP for security
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save OTP and expiry (10 min)
    user.otp = hashedOTP;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send email with OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Book Website" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error sending OTP" });
  }
};

/* -------------------------------------------------------------------------- */
/* 🔑 RESET PASSWORD                                                         */
/* -------------------------------------------------------------------------- */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ message: "No OTP found. Please request again." });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired. Please request again." });

    // Compare entered OTP with stored hash
    const isValidOTP = await bcrypt.compare(otp, user.otp);
    if (!isValidOTP)
      return res.status(400).json({ message: "Invalid OTP" });

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error resetting password" });
  }
};
