import { HTTP_STATUS } from "../../../constants/http.js";
import { successResponse } from "../../../utils/responseFormatter.js";
import { AuthService } from "../service/index.js";

export const registerCustomer = async (req, res) => {
   let userData = req.body;
   const data = await AuthService.registerUser(userData);
   successResponse(res, {
      message: "User created successfully",
      data: { user: data },
      statusCode: HTTP_STATUS.CREATED,
   });
};
