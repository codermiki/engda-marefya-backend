import { Router } from "express";
import {
   registerValidation,
   handleValidationErrors,
} from "../../../middlewares/validation.js";
import { registerCustomer, registerHotelOwner } from "../controller/index.js";

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

export default router;
