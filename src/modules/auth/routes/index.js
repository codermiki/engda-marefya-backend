import { Router } from "express";
import {
   registerValidation,
   loginValidation,
   resetPassValidation,
   handleValidationErrors,
   refreshTokenValidation,
} from "../../../middlewares/validation.js";
import {
   registerCustomer,
   registerHotelOwner,
   verifyEmail,
   loginUser,
   forgotPassword,
   resetPassword,
   refreshToken,
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

// Forgot Password route
router.post("/forgot-password", forgotPassword);

// Reset Password route
router.post(
   "/reset-password",
   resetPassValidation,
   handleValidationErrors,
   resetPassword
);

// Refresh Token route
router.post(
   "/refresh-token",
   refreshTokenValidation,
   handleValidationErrors,
   refreshToken
);

export default router;
