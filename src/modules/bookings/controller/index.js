import { HTTP_STATUS } from "../../../constants/http.js";
import { successResponse } from "../../../utils/responseFormatter.js";
import { BookingService } from "../service/index.js";
import AppError from "../../../utils/AppError.js";

// Create booking controller
export const createBooking = async (req, res, next) => {
   try {
      const user_id = req?.user?.id;
      if (!user_id) {
         throw new AppError(
            "Authentication required",
            HTTP_STATUS.UNAUTHORIZED
         );
      }
      const data = await BookingService.createBooking({
         ...req.body,
         user_id,
      });

      return successResponse(res, {
         message: "Booking created successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Get booking details controller
export const getBookingDetails = async (req, res, next) => {
   try {
      const id = req?.params?.id;
      if (!id) {
         throw new AppError("Booking id is required", HTTP_STATUS.BAD_REQUEST);
      }
      const data = await BookingService.getBookingDetails(id);

      return successResponse(res, {
         message: "Booking details retrieved successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};
