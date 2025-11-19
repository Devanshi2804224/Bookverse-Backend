// server/routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_TEST_KEY_ID",
  key_secret: "YOUR_TEST_KEY_SECRET",
});

router.post("/order", async (req, res) => {
  const { amount } = req.body; // amount in paise
  try {
    const order = await razorpay.orders.create({
      amount: amount, // e.g., 50000 = ₹500
      currency: "INR",
      payment_capture: 1, // auto capture
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ error: "Unable to create order" });
  }
});

module.exports = router;
