import pool from "../../../config/db.js";
import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";

class UserModel {
   // Create a new user
   static async create(userData) {
      const {
         id,
         user_name,
         email,
         phone_number = null,
         password_hash,
         profile_pic_url = null,
         role = "customer",
         status = "active",
         is_email_verified = false,
      } = userData;

      const query = `
      INSERT INTO users (id, user_name, email, phone_number, password_hash, profile_pic_url, role, status, is_email_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
         id,
         user_name,
         email,
         phone_number,
         password_hash,
         profile_pic_url,
         role,
         status,
         is_email_verified,
      ];

      try {
         const [result] = await pool.execute(query, values);
         return { id, ...userData };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("email")) {
               throw new AppError(
                  "User already exists with this email",
                  HTTP_STATUS.BAD_REQUEST
               );
            } else if (error.message.includes("phone_number")) {
               throw new AppError(
                  "User already exists with this phone number",
                  HTTP_STATUS.BAD_REQUEST
               );
            }
         }
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Find user by email
   static async findByEmail(email) {
      const query = "SELECT * FROM users WHERE email = ?";

      try {
         const [rows] = await pool.execute(query, [email]);
         return rows[0] || null;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Find user by phone number
   static async findByPhoneNumber(phoneNumber) {
      const query = "SELECT * FROM users WHERE phone_number = ?";

      try {
         const [rows] = await pool.execute(query, [phoneNumber]);
         return rows[0] || null;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}

export default UserModel;
