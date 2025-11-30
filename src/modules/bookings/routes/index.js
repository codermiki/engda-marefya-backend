import { Router } from "express";
import {
   createBooking,
   getBookingDetails,
   cancelBooking,
   getUserBookings,
   getHotelBookings,
} from "../controller/index.js";
import { verifyToken } from "../../../middlewares/authMiddleware.js";
import {
   createBookingValidation,
   handleValidationErrors,
} from "../../../middlewares/validation.js";

const router = Router();

// Create booking
router.post(
   "/",
   verifyToken,
   createBookingValidation,
   handleValidationErrors,
   createBooking
);

// Get booking details
router.get("/:id", verifyToken, getBookingDetails);

// Cancel booking
router.post("/:id/cancel", verifyToken, cancelBooking);

// Get user bookings
router.get("/user/:id", verifyToken, getUserBookings);

// Get hotel bookings
router.get("/hotel/:id", verifyToken, getHotelBookings);

export default router;
