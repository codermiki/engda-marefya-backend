import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import { successResponse } from "../../../utils/responseFormatter.js";
import { PaymentService } from "../service/index.js";

// Initiate Payment controller
export const initiatePayment = async (req, res, next) => {
   try {
      const user_id = req?.user?.id;
      const { booking_id } = req.body;

      if (!user_id) {
         throw new AppError(
            "Authentication required",
            HTTP_STATUS.UNAUTHORIZED
         );
      }

      const payment = await PaymentService.createPayment(user_id, booking_id);

      return successResponse(res, {
         message: "Payment initiated successfully",
         data: payment,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};
