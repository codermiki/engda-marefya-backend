import { body, validationResult } from "express-validator";
import { HTTP_STATUS } from "../constants/http.js";
import { ERROR_TEMPLATES } from "../constants/errors.js";
import AppError from "../utils/AppError.js";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new AppError(
         ERROR_TEMPLATES[400].message,
         HTTP_STATUS.BAD_REQUEST,
         true,
         errors.array()
      );
   }
   next();
};

// Register validation
export const registerValidation = [
   body("first_name")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("First name must be between 2 and 100 characters"),

   body("last_name")
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Last name must be between 2 and 100 characters"),

   body("email").isEmail().withMessage("Valid email is required"),

   body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
         "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),

   body("phone_number")
      .isMobilePhone()
      .withMessage("Valid phone number is required"),

   body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["customer", "hotel_owner"])
      .withMessage("Invalid role"),
];

// Update user profile validation all fields are optional but one field is required to update
export const updateUserProfileValidation = (req, res, next) => {
   const updateData = req.body;
   if (!updateData) {
      throw new AppError(
         "At least one field is required",
         HTTP_STATUS.BAD_REQUEST
      );
   }
   if (Object.keys(updateData).length === 0) {
      throw new AppError(
         "At least one field is required",
         HTTP_STATUS.BAD_REQUEST
      );
   }
   next();
};

// Login validation
export const loginValidation = [
   body("email").isEmail().withMessage("Valid email is required"),

   body("password").notEmpty().withMessage("Password is required"),
];

// Reset password validation
export const resetPassValidation = [
   body("new_password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
         "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
];

// Create hotel validation
export const createHotelValidation = [
   body("name").notEmpty().withMessage("Hotel name is required"),
   body("location").notEmpty().withMessage("Hotel location is required"),
   body("contact_info")
      .notEmpty()
      .withMessage("Hotel contact info is required"),
   body("description").notEmpty().withMessage("Hotel description is required"),
   body("business_license_url")
      .notEmpty()
      .withMessage("Hotel business license is required"),
   body("profile_pic_url")
      .notEmpty()
      .withMessage("Hotel profile pic url is required"),
];

// Update hotel validation
// if no field is provided, throw error "At least one field is required"
export const updateHotelValidation = (req, res, next) => {
   const updateData = req.body;
   if (!updateData) {
      throw new AppError(
         "At least one field is required",
         HTTP_STATUS.BAD_REQUEST
      );
   }
   if (Object.keys(updateData).length === 0) {
      throw new AppError(
         "At least one field is required",
         HTTP_STATUS.BAD_REQUEST
      );
   }
   next();
};

// Create room type validation
export const createRoomTypeValidation = [
   body("name").notEmpty().withMessage("Room type name is required"),
   body("description")
      .notEmpty()
      .withMessage("Room type description is required"),
   body("price_per_night")
      .notEmpty()
      .withMessage("Price per night is required"),
   body("main_image_url").notEmpty().withMessage("Main image url is required"),
   body("bed_type").notEmpty().withMessage("Bed type is required"),
   body("number_of_beds").notEmpty().withMessage("Number of beds is required"),
];

// Update room type validation
// if no field is provided, throw error "At least one field is required"
export const updateRoomTypeValidation = (req, res, next) => {
   const updateData = req.body;
   if (!updateData) {
      throw new AppError(
         "At least one field is required",
         HTTP_STATUS.BAD_REQUEST
      );
   }
   if (Object.keys(updateData).length === 0) {
      throw new AppError(
         "At least one field is required",
         HTTP_STATUS.BAD_REQUEST
      );
   }
   next();
};

// Add amenities to a room type validation
export const addRoomTypeAmenitiesValidation = [
   body("amenity_ids").notEmpty().withMessage("Amenity ids are required"),
];

// Add rooms to a room type validation
export const addRoomTypeRoomsValidation = [
   body("room_numbers").notEmpty().withMessage("Room numbers are required"),
];

// Add room type images validation
export const addRoomTypeImagesValidation = [
   body("images").notEmpty().withMessage("Image urls are required"),
];

// Update room type room status validation
export const updateRoomTypeRoomStatusValidation = [
   body("status").notEmpty().withMessage("Status is required"),
];

// Update user status validation
export const updateUserStatusValidation = [
   body("status").notEmpty().withMessage("Status is required"),
];

// Update amenity validation all fields are optional but one field is required to update
export const updateAmenityValidation = (req, res, next) => {
   const updateData = req.body;
   if (!updateData) {
      throw new AppError(
         "At least one field is required",
         HTTP_STATUS.BAD_REQUEST
      );
   }
   if (Object.keys(updateData).length === 0) {
      throw new AppError(
         "At least one field is required",
         HTTP_STATUS.BAD_REQUEST
      );
   }
   next();
};

// Create booking validation
export const createBookingValidation = [
   body("room_id").notEmpty().withMessage("Room id is required"),
   body("check_in").notEmpty().withMessage("Check in date is required"),
   body("check_out").notEmpty().withMessage("Check out date is required"),
];

// Create payment validation
export const createPaymentValidation = [
   body("booking_id").notEmpty().withMessage("Booking id is required"),
];

// Refresh token validation
export const refreshTokenValidation = [
   body("refresh_token").notEmpty().withMessage("Refresh token is required"),
];

// Add review to booking validation
export const addReviewToBookingValidation = [
   body("rating")
      .notEmpty()
      .withMessage("Rating is required")
      .isInt({ min: 1, max: 5 }),
   body("comment").isString().notEmpty().withMessage("Comment is required"),
];

// Add bank details validation
export const addBankDetailsValidation = [
   body("bank_name").notEmpty().withMessage("Bank name is required"),
   body("account_number").notEmpty().withMessage("Account number is required"),
   body("account_holder_name")
      .notEmpty()
      .withMessage("Account holder name is required"),
];
