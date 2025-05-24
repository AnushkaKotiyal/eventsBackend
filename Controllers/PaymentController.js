const razorpay = require("razorpay");
const crypto = require("crypto");
const Booking=require('../Models/Bookings');
const Payment=require('../Models/Payments');
require('dotenv').config();
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret:process.env.RAZORPAY_SECRET,
});

const createRazorpayOrder = async (amount) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt#${new Date().getTime()}`,
      notes: {
        key1: "value1",
        key2: "value2",
      },
    });
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

// Function to verify payment status using Razorpay's API
const verifyPayment = async (payment_id, order_id, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature === signature) {
      // Successfully verified, update payment and booking status
      await updatePaymentStatus(payment_id, "Completed");

      const booking = await Booking.findOne({
        where: { razorpay_order_id: order_id },
      });
      if (booking) {
        await booking.update({ payment_status: "Completed" });
      }
      return { success: true };
    } else {
      return { success: false, message: "Signature mismatch" };
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false, message: "Error verifying payment" };
  }
};

// Update payment status in your Payments table

const updatePaymentStatus = async (payment_id, status) => {
  try {
    const payment = await Payment.findOne({ where: { payment_id } });
    if (!payment) {
      console.error(`Payment record with ID ${payment_id} not found`);
      throw new Error("Payment record not found");
    }
    await payment.update({ status }); 
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  updatePaymentStatus,
};
