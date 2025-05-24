const Booking = require("../Models/Bookings");
const Payment = require("../Models/Payments");
const User=require('../Models/Users');
const Event=require('../Models/Events');
const { createRazorpayOrder } = require("./PaymentController");

const createBooking = async (req, res) => {
  try {
    const { event_id, user_id, tickets_booked, total_amount, payment_method } =
      req.body;
    if (
      !event_id ||
      !user_id ||
      !tickets_booked ||
      !total_amount ||
      !payment_method
    ) {
      return res.status(400).json({
        success: false,
        message: "Fill all the Mandatory Fields",
        error: "Missing fields",
      });
    }
    const userExists = await User.findByPk(user_id);
    const eventExists = await Event.findByPk(event_id);

    if (!userExists) {
      return res.status(404).send("User not found");
    }
    if (!eventExists) {
      return res.status(404).send("Event not found");
    }
    if(tickets_booked<=0){
      return res.status(400).send("Invalid ticket request");
    }
    const newBooking = await Booking.create({
      event_id,
      user_id,
      tickets_booked,
      total_amount,
    });

    const razorpayOrder = await createRazorpayOrder(total_amount);

    await newBooking.update({
      razorpay_order_id: razorpayOrder.id,
    });

    const payment = await Payment.create({
      razorpay_order_id: razorpayOrder.id,
      user_id,
      amount: total_amount,
      payment_method,
    });

    res.status(201).json({
      booking: newBooking,
      payment: payment,
      razorpay_order_id: razorpayOrder.id,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (booking) {
      res.status(200).json({ booking });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Error fetching booking" });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.destroy({
      where: { booking_id: req.params.id },
    });

    if (deleted) {
      res.status(204).json({ message: "Booking deleted" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking" });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  deleteBooking,
};
