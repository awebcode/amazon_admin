const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "testasikur@gmail.com",
    pass: "lksmaaubugmqdvuj",
  },
});

// Function to send email
const sendEmail = async (data) => {
    console.log(data)
  try {
    const info = await transporter.sendMail({
      from: "testasikur@gmail.com",
        to: data.to,
        subject: data.subject,
        text: data.text,
        html:data.html,
      
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
