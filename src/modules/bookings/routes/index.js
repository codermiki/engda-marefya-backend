import { Router } from "express";
import { createBooking, getBookingDetails } from "../controller/index.js";
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

export default router;
