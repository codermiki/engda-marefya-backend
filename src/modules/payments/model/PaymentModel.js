import pool from "../../../config/db.js";
import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";

class PaymentModel {
   // Create payment
   static async createPayment(paymentData) {
      const {
         id,
         booking_id,
         total_amount,
         currency,
         transaction_reference,
         checkout_url,
      } = paymentData;
      const query = `INSERT INTO payments (id, booking_id, total_amount, currency, transaction_reference, checkout_url)
      VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [
         id,
         booking_id,
         total_amount,
         currency,
         transaction_reference,
         checkout_url,
      ];

      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            return null;
         }

         return { checkout_url };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("transaction_reference")) {
               throw new AppError(
                  "Payment already exists with this transaction reference",
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

   // Get payment details by booking id
   static async getPaymentDetailsByBookingId(booking_id) {
      const query = `SELECT * FROM payments WHERE booking_id = ?`;
      const values = [booking_id];

      try {
         const [result] = await pool.execute(query, values);
         if (result.length === 0) {
            return null;
         }

         return result[0];
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}

export default PaymentModel;
