import { Router } from "express";
import { initiatePayment } from "../controller/index.js";
import { verifyToken } from "../../../middlewares/authMiddleware.js";
import {
   createPaymentValidation,
   handleValidationErrors,
} from "../../../middlewares/validation.js";

const router = Router();

// Initialize payment routes
router.post(
   "/initiate",
   verifyToken,
   createPaymentValidation,
   handleValidationErrors,
   initiatePayment
);

export default router;
