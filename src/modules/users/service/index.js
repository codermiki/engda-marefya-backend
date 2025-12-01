import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import UserModel from "../../auth/model/UserModel.js";

export class UserService {
   static async getUserProfile(id) {
      try {
         const user = await UserModel.findById(id);
         if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }

         return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number,
            profile_pic_url: user.profile_pic_url,
            role: user.role,
            status: user.status,
            is_email_verified: user.is_email_verified,
            created_at: user.created_at,
            updated_at: user.updated_at,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to fetch user profile. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   static async updateUserProfile(id, userData) {
      try {
         const user = await UserModel.findById(id);
         if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }
         const updatedUser = await UserModel.update(id, userData);
         if (!updatedUser) {
            throw new AppError(
               "Failed to update user profile",
               HTTP_STATUS.BAD_REQUEST
            );
         }

         return updatedUser;
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to update user profile. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
