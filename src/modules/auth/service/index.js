import { HTTP_STATUS } from "../../../constants/http.js";
import { USER_ROLES } from "../../../constants/user.js";
import AppError from "../../../utils/AppError.js";
import { generateId } from "../../../utils/idGenerator.js";
import JWTUtils from "../../../utils/JWTUtils.js";
import PasswordUtils from "../../../utils/PasswordUtils.js";
import UserModel from "../model/UserModel.js";

export class AuthService {
   static async registerUser(userData) {
      try {
         const {
            user_name,
            email,
            password,
            phone_number = null,
            role = USER_ROLES.CUSTOMER,
         } = userData;

         // Check if user already exists with email
         const existingUserByEmail = await UserModel.findByEmail(email);
         if (existingUserByEmail) {
            throw new AppError(
               "User already exists with this email",
               HTTP_STATUS.BAD_REQUEST
            );
         }

         // Check if user already exists with phone number
         if (phone_number) {
            const existingUserByPhoneNumber = await UserModel.findByPhoneNumber(
               phone_number
            );
            if (existingUserByPhoneNumber) {
               throw new AppError(
                  "User already exists with this phone number",
                  HTTP_STATUS.BAD_REQUEST
               );
            }
         }

         // Hash password

         const password_hash = await PasswordUtils.hashPassword(
            password,
            process.env.SALT_ROUNDS || 10
         );
         // Generate Object Id
         const id = generateId();

         // Create user
         const user = await UserModel.create({
            id,
            user_name,
            email,
            phone_number,
            password_hash,
            role,
            status: "active",
            is_email_verified: false,
         });

         const token = JWTUtils.createToken({
            userId: user.id,
            email: user.email,
            type: "email_verification",
         });

         // sending verification email goes here
         console.log(
            `http://localhost:9000/api/v1/auth/verify-email?token=${token}`
         );

         return {
            user_id: user.id,
            email: user.email,
            role: user.role,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Registration failed. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   static async verifyEmail(token) {
      try {
         // Verify the JWT token
         const decoded = JWTUtils.verifyToken(token);

         if (decoded.type !== "email_verification") {
            throw new AppError("Invalid token type", HTTP_STATUS.UNAUTHORIZED);
         }

         // Find user by ID from token
         const user = await UserModel.findById(decoded.userId);
         if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }

         // Check if email is already verified
         if (user.is_email_verified) {
            throw new AppError(
               "Email is already verified",
               HTTP_STATUS.BAD_REQUEST
            );
         }

         // Update user's email verification status
         await UserModel.update(decoded.userId, {
            is_email_verified: true,
         });

         return {
            user_id: user.id,
            email: user.email,
            is_email_verified: true,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise create new AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Email verification failed",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
