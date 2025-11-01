import { HTTP_STATUS } from "../../../constants/http.js";
import { USER_ROLES } from "../../../constants/user.js";
import AppError from "../../../utils/AppError.js";
import { generateId } from "../../../utils/idGenerator.js";
import PasswordUtils from "../../../utils/PasswordUtils.js";
import UserModel from "../model/UserModel.js";

export class AuthService {
   static async registerUser(userData) {
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

      return {
         user_id: user.id,
         email: user.email,
         role: user.role,
      };
   }
}
