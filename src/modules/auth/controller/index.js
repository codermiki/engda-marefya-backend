import { HTTP_STATUS } from "../../../constants/http.js";
import { USER_ROLES } from "../../../constants/user.js";
import { successResponse } from "../../../utils/responseFormatter.js";
import { AuthService } from "../service/index.js";

// Register customer controller
export const registerCustomer = async (req, res) => {
   let userData = req.body;
   const data = await AuthService.registerUser(userData);
   successResponse(res, {
      message: "User created successfully",
      data: { user: data },
      statusCode: HTTP_STATUS.CREATED,
   });
};

// Register hotel owner controller
export const registerHotelOwner = async (req, res) => {
   let userData = req.body;
   userData.role = USER_ROLES.HOTEL_OWNER;
   const data = await AuthService.registerUser(userData);
   successResponse(res, {
      message: "User created successfully",
      data: { user: data },
      statusCode: HTTP_STATUS.CREATED,
   });
};
