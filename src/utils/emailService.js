import nodemailer from "nodemailer";
import { generateId } from "./idGenerator.js";
import EmailLogModel from "../modules/auth/model/EmailLogModel.js";
import AppError from "./AppError.js";
import { HTTP_STATUS } from "../constants/http.js";

/**
 * Email Service Utility
 * Handles sending various types of emails with logging and error handling
 */
class EmailService {
   constructor() {
      this.transporter = null;
      this.initializeTransporter();
   }

   initializeTransporter() {
      try {
         // Gmail SMTP configuration
         this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
               user: process.env.SMTP_USER,
               pass: process.env.SMTP_PASS,
            },
            // Gmail specific settings
            tls: {
               rejectUnauthorized: false,
            },
         });

         // Verify transporter configuration
         this.verifyTransporter();
      } catch (error) {
         console.error("Failed to initialize email transporter:", error);
      }
   }

   async verifyTransporter() {
      try {
         if (this.transporter) {
            await this.transporter.verify();
            console.log("==> Email transporter is ready to send messages");
         }
      } catch (error) {
         console.error(
            "==> Email transporter verification failed:",
            error.message
         );
      }
   }

   /**
    * Send email with logging
    */
   async sendEmail(mailOptions, emailType = "other") {
      let emailLogId = null;

      try {
         // Validate transporter
         if (!this.transporter) {
            throw new AppError(
               "Email service is not configured",
               HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
         }

         // Create email log
         emailLogId = generateId();
         await EmailLogModel.create({
            id: emailLogId,
            to_email: mailOptions.to,
            subject: mailOptions.subject,
            body: mailOptions.html || mailOptions.text,
            email_type: emailType,
            status: "pending",
         });

         // Set default from address
         if (!mailOptions.from) {
            mailOptions.from =
               process.env.EMAIL_FROM || "noreply@engda-marefya.com";
         }

         // Send email
         const result = await this.transporter.sendMail(mailOptions);

         // Update email log to sent
         await EmailLogModel.updateStatus(emailLogId, "sent");

         console.log(`Email sent successfully to: ${mailOptions.to}`);
         return result;
      } catch (error) {
         // Update email log to failed
         if (emailLogId) {
            await EmailLogModel.updateStatus(emailLogId, "failed");
         }

         console.error("Failed to send email:", error);

         return null;
      }
   }

   /**
    * Send email verification email
    */
   async sendVerificationEmail(toEmail, verificationToken) {
      try {
         const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

         const mailOptions = {
            to: toEmail,
            subject: "Verify Your Email - Engda Marefya",
            html: this.getVerificationEmailTemplate(verificationLink),
         };

         await this.sendEmail(mailOptions, "email_verification");
      } catch (error) {
         console.error("Failed to send verification email:", error);
      }
   }

   /**
    * Send password reset email
    */
   async sendPasswordResetEmail(toEmail, resetToken) {
      try {
         const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

         const mailOptions = {
            to: toEmail,
            subject: "Reset Your Password - Engda Marefya",
            html: this.getPasswordResetEmailTemplate(resetLink),
         };

         await this.sendEmail(mailOptions, "password_reset");
      } catch (error) {
         console.error("Failed to send password reset email:", error);
      }
   }

   /**
    * Send password changed confirmation email
    */
   async sendPasswordChangedEmail(toEmail) {
      try {
         const mailOptions = {
            to: toEmail,
            subject: "Password Changed - Engda Marefya",
            html: this.getPasswordChangedEmailTemplate(),
         };

         await this.sendEmail(mailOptions, "password_changed");
      } catch (error) {
         console.error("Failed to send password changed email:", error);
      }
   }

   /**
    * Send booking confirmation email
    */
   async sendBookingConfirmationEmail(toEmail, bookingDetails) {
      try {
         const mailOptions = {
            to: toEmail,
            subject: "Booking Confirmed - Engda Marefya",
            html: this.getBookingConfirmationTemplate(bookingDetails),
         };

         await this.sendEmail(mailOptions, "booking_confirmation");
      } catch (error) {
         console.error("Failed to send booking confirmation email:", error);
      }
   }

   /**
    * Send welcome email to new users
    */
   async sendWelcomeEmail(toEmail, userName) {
      try {
         const mailOptions = {
            to: toEmail,
            subject: "Welcome to Engda Marefya!",
            html: this.getWelcomeEmailTemplate(userName),
         };

         await this.sendEmail(mailOptions, "welcome");
      } catch (error) {
         console.error("Failed to send welcome email:", error);
      }
   }

   /**
    * Email Templates
    */

   getVerificationEmailTemplate(verificationLink) {
      return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: #ffff; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffff; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Welcome to Engda Marefya!</h2>
            <p>Please verify your email address to complete your registration and start booking hotels.</p>
            <p>Click the button below to verify your email:</p>
            <table
               border="0"
               cellpadding="0"
               cellspacing="0"
               style="margin: 20px 0; width: 100%"
             >
               <tr>
                  <td align="center">
                     <a
                        href="${verificationLink}"
                        style="
                           background-color: #2563eb;
                           color: #ffffff;
                           padding: 12px 30px;
                           text-decoration: none;
                           border-radius: 4px;
                           font-family: Arial, sans-serif;
                           font-size: 16px;
                           font-weight: bold;
                           display: inline-block;
                        "
                     >
                        Verify Email Address
                     </a>
                  </td>
               </tr>
            </table>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${verificationLink}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Engda Marefya. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
   }

   getPasswordResetEmailTemplate(resetLink) {
      return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: #ffff; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: #ffff; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password for your Engda Marefya account.</p>
            <p>Click the button below to reset your password:</p>
            <table
               border="0"
               cellpadding="0"
               cellspacing="0"
               style="margin: 20px 0; width: 100%"
             >
               <tr>
                  <td align="center">
                     <a
                        href="${resetLink}"
                        style="
                           background-color: #2563eb;
                           color: #ffffff;
                           padding: 12px 30px;
                           text-decoration: none;
                           border-radius: 4px;
                           font-family: Arial, sans-serif;
                           font-size: 16px;
                           font-weight: bold;
                           display: inline-block;
                        "
                     >
                        Reset Password
                     </a>
                  </td>
               </tr>
            </table>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #dc2626;">${resetLink}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Engda Marefya. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
   }

   getPasswordChangedEmailTemplate() {
      return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: #ffff; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Changed</h1>
          </div>
          <div class="content">
            <h2>Your Password Has Been Updated</h2>
            <p>Your Engda Marefya account password was recently changed.</p>
            <p>If you made this change, no further action is needed.</p>
            <p><strong>If you didn't make this change, please contact our support team immediately.</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Engda Marefya. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
   }

   getWelcomeEmailTemplate(userName) {
      return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7c3aed; color: #ffff; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Engda Marefya!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for joining Engda Marefya - your gateway to the best hotel booking experience in Ethiopia.</p>
            <p>With your account, you can:</p>
            <ul>
              <li>Book hotels across Ethiopia</li>
              <li>Manage your reservations</li>
              <li>Receive exclusive deals and offers</li>
              <li>Save your favorite hotels</li>
            </ul>
            <p>Start exploring and book your perfect stay today!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Engda Marefya. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
   }

   getBookingConfirmationTemplate(bookingDetails) {
      return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: #ffff; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .booking-details { background: #ffff; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Your booking has been confirmed</h2>
            <p>Thank you for booking with Engda Marefya. Here are your booking details:</p>
            
            <div class="booking-details">
              <h3>Booking Information</h3>
              <p><strong>Booking Reference:</strong> ${
                 bookingDetails.booking_reference
              }</p>
              <p><strong>Hotel:</strong> ${bookingDetails.hotel_name}</p>
              <p><strong>Room Type:</strong> ${bookingDetails.room_type}</p>
              <p><strong>Check-in:</strong> ${bookingDetails.check_in}</p>
              <p><strong>Check-out:</strong> ${bookingDetails.check_out}</p>
              <p><strong>Total Amount:</strong> ${
                 bookingDetails.total_amount
              } ETB</p>
            </div>
            
            <p>We look forward to hosting you!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Engda Marefya. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
   }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;
