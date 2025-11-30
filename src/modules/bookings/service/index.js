import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import BookingModel from "../model/BookingModel.js";
import {
   generateBookingReference,
   generateId,
} from "../../../utils/idGenerator.js";

export class BookingService {
   // Create booking service
   static async createBooking(data) {
      try {
         const id = generateId();
         const booking_reference = generateBookingReference(id);
         const booking = await BookingModel.createBooking({
            id,
            booking_reference,
            ...data,
         });
         if (!booking) {
            throw new AppError(
               "Failed to create booking. Please try again.",
               HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
         }

         return booking;
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to create booking. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get booking details service
   static async getBookingDetails(id) {
      try {
         const booking = await BookingModel.getBookingDetails(id);

         if (!booking) {
            throw new AppError("Booking not found.", HTTP_STATUS.NOT_FOUND);
         }

         return booking;
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to get booking details. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
