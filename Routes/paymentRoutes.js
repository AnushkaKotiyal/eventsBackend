const express = require("express");
const router = express.Router();
const { verifyPayment } = require("../Controllers/PaymentController");

router.post("/verify", async (req, res) => {
  const { payment_id, order_id, signature } = req.body;

  const result = await verifyPayment(payment_id, order_id, signature);

  if (result.success) {
    res.status(200).json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: result.message || "Payment verification failed" });
  }
});

module.exports = router;
