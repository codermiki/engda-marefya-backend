import { Router } from "express";
import {
   registerValidation,
   handleValidationErrors,
} from "../../../middlewares/validation.js";
import {
   registerCustomer,
   registerHotelOwner,
   verifyEmail,
} from "../controller/index.js";

const router = Router();

// Register customer route
router.post(
   "/register/customer",
   registerValidation,
   handleValidationErrors,
   registerCustomer
);

// Register Hotel Owner
router.post(
   "/register/hotel-owner",
   registerValidation,
   handleValidationErrors,
   registerHotelOwner
);

// Verify Email
router.get("/verify-email", verifyEmail);

export default router;
