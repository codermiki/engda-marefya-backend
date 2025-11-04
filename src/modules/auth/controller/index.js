import { HTTP_STATUS } from "../../../constants/http.js";
import { USER_ROLES } from "../../../constants/user.js";
import AppError from "../../../utils/AppError.js";
import { successResponse } from "../../../utils/responseFormatter.js";
import { AuthService } from "../service/index.js";

// Register customer controller
export const registerCustomer = async (req, res, next) => {
   try {
      const userData = req.body;
      const data = await AuthService.registerUser(userData);

      return successResponse(res, {
         message: "User created successfully. Verification email sent.",
         data: { user: data },
         statusCode: HTTP_STATUS.CREATED,
      });
   } catch (error) {
      next(error);
   }
};

// Register hotel owner controller
export const registerHotelOwner = async (req, res, next) => {
   try {
      let userData = req.body;
      userData.role = USER_ROLES.HOTEL_OWNER;
      const data = await AuthService.registerUser(userData);

      return successResponse(res, {
         message: "User created successfully. Verification email sent.",
         data: { user: data },
         statusCode: HTTP_STATUS.CREATED,
      });
   } catch (error) {
      next(error);
   }
};

// Verify Email controller
export const verifyEmail = async (req, res, next) => {
   try {
      const { token } = req.query;

      if (!token) {
         throw new AppError(
            "Verification token is required",
            HTTP_STATUS.BAD_REQUEST
         );
      }

      await AuthService.verifyEmail(token);

      return successResponse(res, {
         message: "Email verified successfully",
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Login user controller
export const loginUser = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      const result = await AuthService.loginUser(email, password);

      return successResponse(res, {
         message: "User login successful",
         data: result,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};
