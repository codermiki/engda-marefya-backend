import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import BookingModel from "../model/BookingModel.js";
import {
   generateBookingReference,
   generateId,
} from "../../../utils/idGenerator.js";
import { PAGINATION } from "../../../constants/pagination.js";

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

   // Cancel booking service
   static async cancelBooking(id) {
      try {
         const booking = await BookingModel.cancelBooking(id);

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
            "Failed to cancel booking. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get user bookings service with pagination
   static async getUserBookings(
      id,
      status,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT
   ) {
      try {
         const totalBookings = await BookingModel.countUserBookings(id, status);
         const totalPages = Math.ceil(totalBookings / limit);
         // page should not exceed total pages
         if (page > totalPages) {
            throw new AppError("Page not found.", HTTP_STATUS.NOT_FOUND);
         }

         const bookings = await BookingModel.getUserBookings(
            id,
            status,
            page,
            limit
         );

         if (!bookings) {
            throw new AppError("User not found.", HTTP_STATUS.NOT_FOUND);
         }

         // prepare pagination
         const pagination = {
            page,
            limit,
            total: totalBookings,
            total_pages: totalPages,
         };

         return { bookings, pagination };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to get user bookings. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get hotel bookings service with pagination
   static async getHotelBookings(
      id,
      status,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT
   ) {
      try {
         const totalBookings = await BookingModel.countHotelBookings(
            id,
            status
         );
         const totalPages = Math.ceil(totalBookings / limit);
         // page should not exceed total pages
         if (page > totalPages) {
            throw new AppError("Page not found.", HTTP_STATUS.NOT_FOUND);
         }

         const bookings = await BookingModel.getHotelBookings(
            id,
            status,
            page,
            limit
         );

         if (!bookings) {
            throw new AppError("Hotel not found.", HTTP_STATUS.NOT_FOUND);
         }

         // prepare pagination
         const pagination = {
            page,
            limit,
            total: totalBookings,
            total_pages: totalPages,
         };

         return { bookings, pagination };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to get hotel bookings. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
