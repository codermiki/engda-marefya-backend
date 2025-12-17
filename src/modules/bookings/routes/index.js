import { Router } from "express";
import {
   createBooking,
   getBookingDetails,
   cancelBooking,
   getUserBookings,
   getHotelBookings,
   addReviewToBooking,
} from "../controller/index.js";
import { verifyToken } from "../../../middlewares/authMiddleware.js";
import {
   addReviewToBookingValidation,
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
router.delete("/:id", verifyToken, cancelBooking);

// Get user bookings
router.get("/user/:id", verifyToken, getUserBookings);

// Get hotel bookings
router.get("/hotel/:id", verifyToken, getHotelBookings);

// Add review to booking
router.post(
   "/:id/reviews",
   verifyToken,
   addReviewToBookingValidation,
   handleValidationErrors,
   addReviewToBooking
);

// Get reviews for a hotel
// router.get("/hotel/:id/reviews", verifyToken, getHotelReviews);

export default router;
