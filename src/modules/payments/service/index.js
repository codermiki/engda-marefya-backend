import chapa from "../../../config/chapa.js";
import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import { generateId } from "../../../utils/idGenerator.js";
import BookingModel from "../../bookings/model/BookingModel.js";
import PaymentModel from "../model/PaymentModel.js";

export class PaymentService {
   // Create payment service
   static async createPayment(user_id, booking_id) {
      // Get booking details
      const booking = await BookingModel.getBookingDetails(booking_id);

      if (!booking) {
         throw new AppError("Booking not found", HTTP_STATUS.NOT_FOUND);
      }
      const oldPayment = await PaymentModel.getPaymentDetailsByBookingId(
         booking_id
      );
      if (oldPayment) {
         if (oldPayment.status === "success") {
            throw new AppError(
               "Payment already completed",
               HTTP_STATUS.BAD_REQUEST
            );
         }
         return { checkout_url: oldPayment.checkout_url };
      }

      //initialize payment
      const initializeInfo = {
         amount: booking.total_amount,
         currency: "ETB",
         email: booking.user.email,
         first_name: booking.user.first_name,
         last_name: booking.user.last_name,
         tx_ref: booking.booking_reference,
         return_url: "https://google.com/",
         callback_url: "https://google.com/",
      };

      // initiate chapa payment

      try {
         const { data } = await chapa.initialize(initializeInfo);

         const id = generateId();
         const payment = await PaymentModel.createPayment({
            id,
            booking_id,
            total_amount: booking.total_amount,
            currency: "ETB",
            transaction_reference: booking.booking_reference,
            checkout_url: data.checkout_url,
         });
         if (!payment) {
            throw new AppError(
               "Failed to create payment. Please try again.",
               HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
         }

         return payment;
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to create payment. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
