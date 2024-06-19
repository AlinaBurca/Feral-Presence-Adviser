const nodemailer = require("nodemailer");
require("dotenv").config();

function sendEmail(emailRecipient, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "feralpresenceadviser@gmail.com",
      pass: "qiptiqezfdoqnwwz",
    },
  });
  const mailOptions = {
    from: "feralpresenceadviser@gmail.com",
    to: emailRecipient,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
module.exports = sendEmail;
