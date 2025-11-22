import { HTTP_STATUS } from "../../../constants/http.js";
import { USER_STATUS } from "../../../constants/user.js";
import AppError from "../../../utils/AppError.js";
import { successResponse } from "../../../utils/responseFormatter.js";
import { AdminService } from "../service/index.js";

// Get users controller
export const getUsers = async (req, res, next) => {
   try {
      // optional Query Parameters: role=customer, status=active, page=1, limit=50
      const { role = null, status = null, page = 1, limit = 50 } = req.query;

      const data = await AdminService.getUsers(
         role,
         status,
         parseInt(page, 10),
         parseInt(limit, 10)
      );

      return successResponse(res, {
         message: "Success",
         data: { users: data.users, pagination: data.meta },
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Update user status controller
export const updateUserStatus = async (req, res, next) => {
   try {
      const id = req.params?.id;
      const status = req.params?.status;

      if (!id) {
         throw new AppError("User id is required", HTTP_STATUS.BAD_REQUEST);
      }
      if (!status) {
         throw new AppError("Status is required", HTTP_STATUS.BAD_REQUEST);
      }
      if (
         ![
            USER_STATUS.ACTIVE,
            USER_STATUS.INACTIVE,
            USER_STATUS.BANNED,
         ].includes(status)
      ) {
         throw new AppError(
            "Invalid status. status must be active, inactive or banned ",
            HTTP_STATUS.BAD_REQUEST
         );
      }

      const data = await AdminService.updateUserStatus(id, status);

      return successResponse(res, {
         message: "User status updated successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Remove user controller
export const removeUser = async (req, res, next) => {
   try {
      const id = req.params?.id;

      if (!id) {
         throw new AppError("User id is required", HTTP_STATUS.BAD_REQUEST);
      }

      const data = await AdminService.removeUser(id);

      return successResponse(res, {
         message: "User removed successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};
