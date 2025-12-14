import pool from "../../../config/db.js";
import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";

class BookingModel {
   // Create a new hotel
   static async createBooking(bookingData) {
      const {
         id,
         user_id,
         room_id,
         check_in,
         check_out,
         total_amount,
         booking_reference,
      } = bookingData;
      const query = `INSERT INTO bookings (id, room_id, user_id, check_in, check_out, total_amount, booking_reference)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [
         id,
         room_id,
         user_id,
         check_in,
         check_out,
         total_amount,
         booking_reference,
      ];

      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            return null;
         }

         return { ...bookingData };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("booking_reference")) {
               throw new AppError(
                  "Booking already exists with this booking reference",
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

   // Get booking details
   static async getBookingDetails(bookingId) {
      const query = `
         SELECT
            b.id,
            b.booking_reference,
            b.check_in,
            b.check_out,
            b.actual_check_out,
            b.status,
            b.total_amount,
            b.created_at,
            r.id AS room_id,
            r.room_number,
            rt.id AS room_type_id,
            rt.name AS room_type_name,
            rt.price_per_night,
            h.id AS hotel_id,
            h.name AS hotel_name,
            h.location AS hotel_location,
            u.id AS user_id,
            u.first_name,
            u.last_name,
            u.email
         FROM
            bookings b
         JOIN
            rooms r ON b.room_id = r.id
         JOIN
            room_types rt ON r.room_type_id = rt.id
         JOIN
            hotels h ON rt.hotel_id = h.id
         JOIN
            users u ON b.user_id = u.id
         WHERE
            b.id = ?;
      `;

      try {
         const [rows] = await pool.execute(query, [bookingId]);

         if (rows.length === 0) {
            return null;
         }

         const booking = rows[0];

         const checkInDate = new Date(booking.check_in);
         const checkOutDate = new Date(booking.check_out);
         const timeDiff = Math.abs(
            checkOutDate.getTime() - checkInDate.getTime()
         );
         const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

         // Get payment details
         const payment = await this.getPaymentByBookingId(bookingId);

         return {
            id: booking.id,
            booking_reference: booking.booking_reference,
            room: {
               id: booking.room_id,
               room_number: booking.room_number,
               room_type: {
                  id: booking.room_type_id,
                  name: booking.room_type_name,
                  price_per_night: parseFloat(booking.price_per_night),
               },
            },
            hotel: {
               id: booking.hotel_id,
               name: booking.hotel_name,
               location: booking.hotel_location,
            },
            user: {
               id: booking.user_id,
               first_name: booking.first_name,
               last_name: booking.last_name,
               email: booking.email,
            },
            check_in: booking.check_in,
            check_out: booking.check_out,
            actual_check_out: booking.actual_check_out
               ? booking.actual_check_out
               : null,
            status: booking.status,
            nights: nights,
            total_amount: parseFloat(booking.total_amount),
            payment: payment || null,
            created_at: booking.created_at,
         };
      } catch (error) {
         throw new AppError(
            "Error fetching booking details",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get payment details
   static async getPaymentByBookingId(bookingId) {
      const query = `
         SELECT
            p.id,
            p.booking_id,
            p.total_amount,
            p.payment_method,
            p.status,
            p.created_at,
            p.updated_at
         FROM
            payments p
         WHERE
            p.booking_id = ?;
      `;

      try {
         const [rows] = await pool.execute(query, [bookingId]);

         if (rows.length === 0) {
            return null;
         }

         return rows[0];
      } catch (error) {
         throw new AppError(
            "Error fetching payment details",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Cancel booking
   static async cancelBooking(id) {
      const query = `UPDATE bookings SET status = 'cancelled' WHERE id = ?`;

      try {
         const [result] = await pool.execute(query, [id]);

         if (result.affectedRows === 0) {
            return null;
         }

         return { id };
      } catch (error) {
         throw new AppError(
            "Error cancelling booking",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get user bookings with pagination
   static async getUserBookings(id, status, page, limit) {
      let values = [id];
      let query = `
         SELECT
            b.id,
            b.booking_reference,
            h.name AS hotel_name,
            rt.name AS room_type,
            r.room_number,
            b.check_in,
            b.check_out,
            b.status,
            b.total_amount,
            b.created_at,
            b.updated_at
         FROM
            bookings b
         JOIN
            rooms r ON b.room_id = r.id
         JOIN
            room_types rt ON r.room_type_id = rt.id
         JOIN
            hotels h ON rt.hotel_id = h.id
         JOIN
            users u ON b.user_id = u.id
         WHERE
            b.user_id = ?`;
      if (status) {
         query += ` AND b.status = ?`;
         values.push(status);
      }
      const offset = (page - 1) * limit;

      query += ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

      try {
         const [rows] = await pool.execute(query, values);

         if (rows.length === 0) {
            return null;
         }

         return rows;
      } catch (error) {
         throw new AppError(
            "Error fetching user bookings",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Count user bookings
   static async countUserBookings(id, status) {
      let values = [id];
      let query = `SELECT COUNT(*) AS count FROM bookings WHERE user_id = ?`;
      if (status) {
         query += ` AND status = ?`;
         values.push(status);
      }
      try {
         const [rows] = await pool.execute(query, values);
         if (rows.length === 0) {
            return 0;
         }

         return rows[0].count;
      } catch (error) {
         throw new AppError(
            "Error counting user bookings",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get hotel bookings
   static async getHotelBookings(id, status, page, limit) {
      let values = [id];
      let query = `SELECT
         b.id,
         b.booking_reference,
         b.check_in,
         b.check_out,
         b.actual_check_out,
         b.status,
         b.total_amount,
         b.created_at,
         b.updated_at,
         r.id AS room_id,
         r.room_number,
         rt.id AS room_type_id,
         rt.name AS room_type_name,
         rt.price_per_night,
         h.id AS hotel_id,
         h.name AS hotel_name,
         h.location AS hotel_location,
         u.id AS user_id,
         u.first_name,
         u.last_name,
         u.email
      FROM
         bookings b
      JOIN
         rooms r ON b.room_id = r.id
      JOIN
         room_types rt ON r.room_type_id = rt.id
      JOIN
         hotels h ON rt.hotel_id = h.id
      JOIN
         users u ON b.user_id = u.id
      WHERE
         h.id = ?`;
      if (status) {
         query += ` AND b.status = ?`;
         values.push(status);
      }
      const offset = (page - 1) * limit;

      query += ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

      try {
         const [rows] = await pool.execute(query, values);

         if (rows.length === 0) {
            return null;
         }

         return rows;
      } catch (error) {
         throw new AppError(
            "Error fetching hotel bookings",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Count hotel bookings
   static async countHotelBookings(id, status) {
      let values = [id];
      let query = `SELECT COUNT(*) AS count FROM bookings b JOIN rooms r ON b.room_id = r.id JOIN room_types rt ON r.room_type_id = rt.id JOIN hotels h ON rt.hotel_id = h.id WHERE h.id = ?`;
      if (status) {
         query += ` AND b.status = ?`;
         values.push(status);
      }
      try {
         const [rows] = await pool.execute(query, values);
         if (rows.length === 0) {
            return 0;
         }

         return rows[0].count;
      } catch (error) {
         throw new AppError(
            "Error counting hotel bookings",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Add review to booking
   static async addReviewToBooking(
      hotel_id,
      booking_id,
      room_type_id,
      rating,
      comment
   ) {
      const query = `INSERT INTO reviews (hotel_id, booking_id, room_type_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)`;
      const values = [hotel_id, booking_id, room_type_id, rating, comment];

      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            return null;
         }

         return { hotel_id, booking_id, room_type_id, rating, comment };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("booking_id")) {
               throw new AppError(
                  "Review already exists for this booking",
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
}

export default BookingModel;
