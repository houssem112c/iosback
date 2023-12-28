// routes/verificationTokenRoutes.js

const express = require("express");
const router = express.Router();
const verificationTokenController = require("../controllers/verificationTokenController"); // Assuming you have authentication middleware
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sameh.benamor@esprit.tn", // Replace with your Gmail email address
    pass: "less koex thji wkgc", // Replace with your Gmail password
  },
});

// Generate and send verification token to the user's email
router.post("/generate/:id", async (req, res) => {
  try {
    ////

    ////
    const userId = req.params.id;
    console.log(userId);
    const token = await verificationTokenController.generateVerificationToken(
      userId
    );

    const user = await User.findById(userId);
    const userEmail = user.email;
    /////
    /*const data = {
      
      code: token
    };*/
    // const renderedTemplate = compiledTemplate(data);
    /////
    // Nodemailer email options
    const mailOptions = {
      from: "sameh.benamor@esprit.tn", // Replace with your Gmail email address
      to: userEmail,
      subject: "Email Verification Token",
      text: `Your verification token is: ${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending verification email" });
      } else {
        console.log("Email sent:", info.response);
        res
          .status(200)
          .json({
            message: "Verification token generated and sent successfully",
          });
      }
    });
    res
      .status(200)
      .json({ message: "Verification token generated and sent successfully" });
  } catch (error) {
    console.error("Error generating verification token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Verify user with the provided pin code
router.post("/verify/:id/:pin", async (req, res) => {
  try {
    const userId = req.params.id;
    const pin = req.params.pin; // Assuming the pin code is sent in the request body

    const isVerified = await verificationTokenController.verifyUser(
      userId,
      pin
    );

    if (isVerified) {
      res.status(200).json({ message: "User verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid pin code" });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/changepass/:email/:pin/:newpass", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const userId = user._id;
    const pin = req.params.pin;
    const newpass = req.params.newpass;
    const isVerified = await verificationTokenController.ForgotPassword(
      userId,
      pin,
      newpass
    );

    if (isVerified) {
      res.status(200).json({ message: "Admin pass changed successfully." });
    } else {
      res.status(400).json({ message: "Invalid pin code" });
    }
  } catch (error) {
    console.error("Error changing user password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
