import { HTTP_STATUS } from "../../../constants/http.js";
import { PAGINATION } from "../../../constants/pagination.js";
import { USER_ROLES } from "../../../constants/user.js";
import AppError from "../../../utils/AppError.js";
import emailService from "../../../utils/emailService.js";
import { generateId } from "../../../utils/idGenerator.js";
import JWTUtils from "../../../utils/JWTUtils.js";
import PasswordUtils from "../../../utils/PasswordUtils.js";
import UserModel from "../../auth/model/UserModel.js";
import HotelModel from "../../hotels/model/HotelModel.js";
import AdminModel from "../model/AdminModal.js";

export class AdminService {
   // Create admin service
   static async createAdmin(userData) {
      try {
         const {
            first_name,
            last_name,
            email,
            password,
            phone_number = null,
            role = USER_ROLES.ADMIN,
         } = userData;

         // Hash password
         const password_hash = await PasswordUtils.hashPassword(
            password,
            process.env.PASSWORD_SALT || 10
         );
         const id = generateId();

         const admin = await UserModel.create({
            id,
            first_name,
            last_name,
            email,
            phone_number,
            password_hash,
            role,
            is_email_verified: false,
         });

         if (!admin) {
            throw new AppError(
               "Failed to create admin. Please try again.",
               HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
         }

         // Create token for email verification
         const token = JWTUtils.createToken(
            {
               id: admin.id,
               email: admin.email,
               type: "email_verification",
            },
            {
               expiresIn: "24h",
            }
         );
         // Send verification email
         await emailService.sendVerificationEmail(admin.email, token);

         return {
            id: admin.id,
            email: admin.email,
            role: admin.role,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to create admin. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get users service with pagination
   static async getAllUsers(
      role,
      status,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT
   ) {
      try {
         const filters = {};
         if (role) {
            filters.role = role;
         }
         if (status) {
            filters.status = status;
         }

         // Get total users count and users data
         const totalUsers = await UserModel.countAllUsers(filters);
         const totalPages = Math.ceil(totalUsers / limit);
         // page should not exceed total pages
         if (page > totalPages) {
            throw new AppError("Page not found.", HTTP_STATUS.NOT_FOUND);
         }

         const usersData = await UserModel.getAllUsers(filters, {
            page,
            limit,
         });

         // prepare users data to return only necessary fields
         const users = usersData.map((user) => ({
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
         }));

         // prepare pagination
         const pagination = {
            page,
            limit,
            total: totalUsers,
            total_pages: totalPages,
         };

         return { users, pagination };
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

   // Update user status service
   static async updateUserStatus(id, status) {
      try {
         const user = await UserModel.findById(id);
         if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }
         const updatedUser = await UserModel.update(id, { status });
         if (!updatedUser) {
            throw new AppError(
               "Failed to update user status",
               HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
         }

         return updatedUser;
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

   // Remove user service
   static async removeUser(id) {
      try {
         const user = await UserModel.findById(id);
         if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
         }
         const removedUser = await UserModel.remove(id);
         if (!removedUser) {
            throw new AppError(
               "Failed to remove user",
               HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
         }

         return removedUser;
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

   // Create amenity service
   static async createAmenity({ name, icon_url }) {
      try {
         // Generate Object Id
         const id = generateId();

         const newAmenity = await HotelModel.createAmenity({
            id,
            name,
            icon_url,
         });
         if (!newAmenity) {
            throw new AppError(
               "Failed to create amenity",
               HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
         }

         return newAmenity;
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

   // Update amenity service
   static async updateAmenity(id, updateData) {
      try {
         const updatedAmenity = await HotelModel.updateAmenity(id, updateData);
         if (!updatedAmenity) {
            throw new AppError("Amenity not found", HTTP_STATUS.NOT_FOUND);
         }

         return updatedAmenity;
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to update Amenities. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Remove amenity service
   static async removeAmenity(id) {
      try {
         const removedAmenity = await HotelModel.removeAmenity(id);
         if (!removedAmenity) {
            throw new AppError("Amenity not found", HTTP_STATUS.NOT_FOUND);
         }

         return removedAmenity;
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to remove Amenities. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get admin dashboard data service
   static async getAdminDashboardData() {
      try {
         const data = await AdminModel.getAdminDashboardData();

         return data;
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to fetch admin dashboard data. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
