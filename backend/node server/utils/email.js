const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.log("Error sending email: ", error);
    throw error;
  }
};

const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `http://localhost:4999/api/v1/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"ThinkFlow" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify your ThinkFlow email address",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #F9F7F7; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(17, 45, 78, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #112D4E 0%, #3F72AF 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ThinkFlow</h1>
            <p style="color: #DBE2EF; margin: 5px 0 0 0; font-size: 14px;">Adaptive Learning Platform</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px 20px; color: #112D4E;">
            <h2 style="color: #112D4E; font-size: 20px; margin-top: 0; margin-bottom: 15px;">Verify Your Email Address</h2>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0;">Hi ${user.email},</p>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0;">Welcome to ThinkFlow! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #3F72AF; color: white; padding: 14px 32px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-size: 16px; font-weight: bold; transition: background-color 0.3s;">Verify Email Address</a>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; margin: 15px 0; color: #3F72AF;">Or copy and paste this link in your browser:</p>
            <p style="font-size: 12px; line-height: 1.6; margin: 15px 0; word-break: break-all; background-color: #F9F7F7; padding: 10px; border-radius: 4px; color: #112D4E;">${verificationUrl}</p>
            
            <p style="font-size: 14px; line-height: 1.6; margin: 20px 0; color: #112D4E;">If you didn't create this account, you can safely ignore this email.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #F9F7F7; padding: 20px; text-align: center; border-top: 1px solid #DBE2EF;">
            <p style="font-size: 12px; color: #3F72AF; margin: 5px 0;">© 2024 ThinkFlow. All rights reserved.</p>
            <p style="font-size: 11px; color: #112D4E; margin: 5px 0;">Adaptive Learning Platform</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await sendEmail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.log("Error sending verification email: ", error);
  }
};
