import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: Number(process.env.NODEMAILER_PORT) || 465,
  secure: Boolean(process.env.NODEMAILER_SECURITY),
  auth: {
    user: "maddison53@ethereal.email",
    pass: process.env.NODEMAILER_LESS_SECURE_PASS,
  },
});

const generateOtp = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

const sendMail = async (user, isOtpMail = false) => {
  try {
    // Generate OTP if it's an OTP mail
    const otpCode = isOtpMail ? generateOtp() : undefined;

    // Customize the email content based on whether it's an OTP mail
    const subject = isOtpMail ? "Your OTP Code" : "Hello ✔";
    const text = isOtpMail
      ? `Your OTP code is ${otpCode}. It will expire in 10 minutes.`
      : "Hello world?";
    const html = isOtpMail
      ? `<p>Your OTP code is <b>${otpCode}</b>. It will expire in 10 minutes.</p>`
      : "<b>Hello world?</b>";

    const info = await transporter.sendMail({
      from: '"Linkaroo By Ascedium" <ascediumorg@gmail.com>',
      to: user,
      subject,
      text,
      html,
    });

    console.log(info)
    return {
      success: true,
      messageId: info.messageId,
      isOtpMail,
      otpCode
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      isOtpMail,
    };
  }
};

export default sendMail;
