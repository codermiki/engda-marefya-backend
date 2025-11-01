import { Router } from "express";
import {
   registerValidation,
   handleValidationErrors,
} from "../../../middlewares/validation.js";
import { registerCustomer } from "../controller/index.js";

const router = Router();

// Register customer route
router.post(
   "/register/customer",
   registerValidation,
   handleValidationErrors,
   registerCustomer
);

export default router;
