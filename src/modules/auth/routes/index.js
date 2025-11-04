import { Router } from "express";
import {
   registerValidation,
   loginValidation,
   handleValidationErrors,
} from "../../../middlewares/validation.js";
import {
   registerCustomer,
   registerHotelOwner,
   verifyEmail,
   loginUser,
} from "../controller/index.js";

const router = Router();

// Register customer route
router.post(
   "/register/customer",
   registerValidation,
   handleValidationErrors,
   registerCustomer
);

// Register Hotel Owner route
router.post(
   "/register/hotel-owner",
   registerValidation,
   handleValidationErrors,
   registerHotelOwner
);

// Verify Email route
router.get("/verify-email", verifyEmail);

// Login user route
router.post("/login", loginValidation, handleValidationErrors, loginUser);

export default router;
