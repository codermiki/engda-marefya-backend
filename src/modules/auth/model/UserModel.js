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

   // Find user by ID
   static async findById(id) {
      const query = "SELECT * FROM users WHERE id = ?";

      try {
         const [rows] = await pool.execute(query, [id]);
         return rows[0] || null;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // find users with filters
   static async getAllUsers(filters = {}, { page, limit }) {
      const offset = (page - 1) * limit;
      let query = "SELECT * FROM users";
      const conditions = [];
      const values = [];
      // Apply filters
      for (const key in filters) {
         conditions.push(`${key} = ?`);
         values.push(filters[key]);
      }
      if (conditions.length > 0) {
         query += " WHERE " + conditions.join(" AND ");
      }
      // Apply pagination
      query += ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

      try {
         const [rows] = await pool.execute(query, values);

         return rows;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Count users with filters
   static async countAllUsers(filters = {}) {
      let query = "SELECT COUNT(*) as count FROM users";
      const conditions = [];
      const values = [];
      // Apply filters
      for (const key in filters) {
         conditions.push(`${key} = ?`);
         values.push(filters[key]);
      }
      if (conditions.length > 0) {
         query += " WHERE " + conditions.join(" AND ");
      }
      try {
         const [rows] = await pool.execute(query, values);
         return rows[0].count;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Update user
   static async update(id, updateData) {
      const allowedFields = [
         "user_name",
         "phone_number",
         "profile_pic_url",
         "password_hash",
         "is_email_verified",
         "status",
         "role",
      ];

      const setClause = [];
      const values = [];

      allowedFields.forEach((field) => {
         if (updateData[field] !== undefined) {
            setClause.push(`${field} = ?`);
            values.push(updateData[field]);
         }
      });

      if (setClause.length === 0) {
         throw new AppError(
            "No valid fields to update",
            HTTP_STATUS.BAD_REQUEST
         );
      }

      setClause.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      const query = `UPDATE users SET ${setClause.join(", ")} WHERE id = ?`;

      try {
         const [result] = await pool.execute(query, values);

         if (result.affectedRows === 0) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }

         // Return updated user
         return await this.findById(id);
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("phone_number")) {
               throw new AppError(
                  "Phone number already exists",
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

   // Remove user
   static async remove(id) {
      const query = "DELETE FROM users WHERE id = ?";

      try {
         const user = await this.findById(id);
         const [result] = await pool.execute(query, [id]);

         if (result.affectedRows === 0) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }

         return user;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}

export default UserModel;
