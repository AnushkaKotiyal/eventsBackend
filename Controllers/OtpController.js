const User=require('../Models/Users');
const OTP_Log=require('../Models/OtpLog');
const { mailSender } = require('../Utils/mailSender');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); 
function toSQLDateTimeString(date) {
  return date.toISOString()
    .replace('T', ' ')
    .substring(0,19); 
}

// const sendOtp = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const otp = generateOtp();
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

//     await OTP_Log.create({
//       user_id: user.user_id,
//       otp_code: otp,
//       expires_at: expiresAt,
//     });

//     await mailSender(email, otp);

//     res.status(200).json({ success: true, message: "OTP sent to your email." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to send OTP." });
//   }
// };

const sendOtp = async (req, res) => { 
  const { email } = req.body;
  try {
    const otp = generateOtp();
    
    await OTP_Log.create({ 
      email:email,
      otp_code: otp,
    });

    await mailSender(email, otp);

    res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

// const verifyOtp = async (req, res) => {
//     const { email, otp } = req.body;
  
//     try {
//       const user = await User.findOne({ where: { email } });
//       if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
//       const otpLog = await OTP_Log.findOne({
//         where: {
//           user_id: user.user_id,
//           otp_code: otp,
//           verified: false,
//         },
//         order: [['created_at', 'DESC']]
//       });
  
//       if (!otpLog) return res.status(400).json({ success: false, message: "Invalid OTP" });
  
//       if (new Date() > otpLog.expires_at) {
//         return res.status(400).json({ success: false, message: "OTP expired" });
//       }
  
//       otpLog.verified = true;
//       await otpLog.save();
  
//       res.status(200).json({ success: true, message: "OTP verified successfully" });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: "Verification failed" });
//     }
//   };
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpLog = await OTP_Log.findOne({
      where: {
        email:email,
        otp_code: otp,
        verified: false,
      },
      order: [['created_at', 'DESC']]
    });

    if (!otpLog) return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (new Date() > otpLog.expires_at) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    otpLog.verified = true;
    await otpLog.save();

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

module.exports={
    sendOtp,
    verifyOtp
}