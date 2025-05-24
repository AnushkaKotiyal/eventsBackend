const nodemailer = require("nodemailer");
require('dotenv').config();
exports.mailSender = async (email, otp) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { 
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, 
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:email,
    subject: "Your OTP for Verification",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
