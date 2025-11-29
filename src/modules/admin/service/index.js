import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import UserModel from "../../auth/model/UserModel.js";
import HotelModel from "../../hotels/model/HotelModel.js";

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

   static async removeUser(id) {
      try {
         const user = await UserModel.findById(id);
         if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }
         const removedUser = await UserModel.remove(id);

         return {
            id: removedUser.id,
            user_name: removedUser.user_name,
            email: removedUser.email,
            phone_number: removedUser.phone_number,
            profile_pic_url: removedUser.profile_pic_url,
            role: removedUser.role,
            status: removedUser.status,
            is_email_verified: removedUser.is_email_verified,
            created_at: removedUser.created_at,
            updated_at: removedUser.updated_at,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to remove user. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   static async createAmenity({ name, icon_url }) {
      try {
         // Generate Object Id
         const id = generateId();

         const newAmenity = await HotelModel.createAmenity({
            id,
            name,
            icon_url,
         });

         return {
            id: newAmenity.id,
            name: newAmenity.name,
            icon_url: newAmenity.icon_url,
            created_at: newAmenity.created_at,
            updated_at: newAmenity.updated_at,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to create Amenities. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
