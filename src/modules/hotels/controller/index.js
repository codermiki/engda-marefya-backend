import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import { successResponse } from "../../../utils/responseFormatter.js";
import { HotelService } from "../service/index.js";

// Create a new hotel
export const createHotel = async (req, res, next) => {
   try {
      const {
         owner_id,
         name,
         location,
         contact_info,
         description,
         business_license,
         profile_pic_url,
      } = req.body;

      if (
         !name ||
         !location ||
         !contact_info ||
         !description ||
         !business_license ||
         !profile_pic_url
      ) {
         throw new AppError("All fields are required", HTTP_STATUS.BAD_REQUEST);
      }

      const data = await HotelService.createHotel({
         owner_id,
         name,
         location,
         contact_info,
         description,
         business_license,
         profile_pic_url,
      });

      return successResponse(res, {
         message: "Hotel created successfully",
         data,
         statusCode: HTTP_STATUS.CREATED,
      });
   } catch (error) {
      next(error);
   }
};

// Create a new room type for a hotel
export const createRoomType = async (req, res, next) => {
   try {
      const { hotelId } = req.params;
      const {
         name,
         description,
         price_per_night,
         main_image_url,
         amenity_ids,
      } = req.body;

      // Basic validation
      if (!name || !description || !price_per_night || !main_image_url) {
         throw new AppError("All fields are required", HTTP_STATUS.BAD_REQUEST);
      }
      // Call service to create room type
      const data = await HotelService.createRoomType({
         hotelId,
         name,
         description,
         price_per_night,
         main_image_url,
         amenity_ids,
      });

      return successResponse(res, {
         message: "Room type created successfully",
         data,
         statusCode: HTTP_STATUS.CREATED,
      });
   } catch (error) {
      next(error);
   }
};

// Create a new Amenities
export const createAmenity = async (req, res, next) => {
   try {
      const { name, icon_url } = req.body;

      // Basic validation
      if (!name || !icon_url) {
         throw new AppError("All fields are required", HTTP_STATUS.BAD_REQUEST);
      }
      // Call service to create room type
      const data = await HotelService.createAmenity({
         name,
         icon_url,
      });

      return successResponse(res, {
         message: "Amenities created successfully",
         data,
         statusCode: HTTP_STATUS.CREATED,
      });
   } catch (error) {
      next(error);
   }
};

// Add amenities for the room
export const addRoomTypeAmenities = async (req, res, next) => {
   try {
      const { roomTypeId } = req.params;
      const { amenity_ids } = req.body;

      // Basic validation
      if (!amenity_ids.length) {
         throw new AppError(
            "Select at least one amenities",
            HTTP_STATUS.BAD_REQUEST
         );
      }
      // Call service to create room type
      const data = await HotelService.addRoomTypeAmenities({
         roomTypeId,
         amenity_ids,
      });

      return successResponse(res, {
         message: "Amenities added successfully",
         data,
         statusCode: HTTP_STATUS.CREATED,
      });
   } catch (error) {
      next(error);
   }
};
