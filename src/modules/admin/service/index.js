import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import UserModel from "../../auth/model/UserModel.js";

export class AdminService {
   static async getUsers(role, status, page, limit) {
      try {
         const filters = {};
         if (role) {
            filters.role = role;
         }
         if (status) {
            filters.status = status;
         }

         // Get total users count and users data
         const totalUsers = await UserModel.countAll(filters);
         const usersData = await UserModel.findAll(filters, { page, limit });

         // prepare users data to return only necessary fields
         const users = usersData.map((user) => ({
            id: user.id,
            user_name: user.user_name,
            email: user.email,
            phone_number: user.phone_number,
            profile_pic_url: user.profile_pic_url,
            role: user.role,
            status: user.status,
            is_email_verified: user.is_email_verified,
            created_at: user.created_at,
            updated_at: user.updated_at,
         }));
         let meta = {};
         // prepare meta information
         if (page && limit) {
            meta.page = page;
            meta.limit = limit;
            meta.total = totalUsers;
         } else {
            meta.page = parseInt(1, 10);
            meta.limit = parseInt(totalUsers, 10);
            meta.total = parseInt(totalUsers, 10);
         }

         return { users, meta };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to fetch users. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   static async updateUserStatus(id, status) {
      try {
         const user = await UserModel.findById(id);
         if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }
         const updatedUser = await UserModel.update(id, { status });

         return {
            id: updatedUser.id,
            user_name: updatedUser.user_name,
            email: updatedUser.email,
            phone_number: updatedUser.phone_number,
            profile_pic_url: updatedUser.profile_pic_url,
            role: updatedUser.role,
            status: updatedUser.status,
            is_email_verified: updatedUser.is_email_verified,
            created_at: updatedUser.created_at,
            updated_at: updatedUser.updated_at,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to update user status. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
