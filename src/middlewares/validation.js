import { body, validationResult } from "express-validator";
import { HTTP_STATUS } from "../constants/http.js";
import { errorResponse } from "../utils/responseFormatter.js";
import { ERROR_TEMPLATES } from "../constants/errors.js";

export const handleValidationErrors = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      errorResponse(res, {
         error: ERROR_TEMPLATES[400].error,
         message: ERROR_TEMPLATES[400].message,
         statusCode: HTTP_STATUS.BAD_REQUEST,
         details: errors,
      });
   }
   next();
};

export const registerValidation = [
   body("user_name")
      .notEmpty()
      .withMessage("User name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("User name must be between 2 and 100 characters"),

   body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

   body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
         "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),

   body("phone_number")
      .optional()
      .isMobilePhone()
      .withMessage("Valid phone number is required"),
];

export const loginValidation = [
   body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

   body("password").notEmpty().withMessage("Password is required"),
];
