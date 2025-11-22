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

// Update a Hotel
export const updateHotel = async (req, res, next) => {
   try {
      const { hotelId } = req.params;
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
         throw new AppError("No update data provided", HTTP_STATUS.BAD_REQUEST);
      }

      const data = await HotelService.updateHotel(hotelId, updateData);

      return successResponse(res, {
         message: "Hotel updated successfully",
         data,
         statusCode: HTTP_STATUS.OK,
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

// get room types details
export const getRoomTypesById = async (req, res, next) => {
   try {
      const { roomTypeId } = req.params;
      const data = await HotelService.getRoomTypeById(roomTypeId);

      return successResponse(res, {
         message: "Room type fetched successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// update room type
export const updateRoomType = async (req, res, next) => {
   try {
      const { roomTypeId } = req.params;
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
         throw new AppError("No update data provided", HTTP_STATUS.BAD_REQUEST);
      }

      const data = await HotelService.updateRoomType(roomTypeId, updateData);

      return successResponse(res, {
         message: "Room type updated successfully",
         data,
         statusCode: HTTP_STATUS.OK,
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

// get amenities
export const getAmenities = async (req, res, next) => {
   try {
      const data = await HotelService.getAmenities();

      return successResponse(res, {
         message: "Amenities fetched successfully",
         data: { amenities: data },
         statusCode: HTTP_STATUS.OK,
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

// Add rooms for a room type
export const addRoomTypeRooms = async (req, res, next) => {
   try {
      const { roomTypeId } = req.params;
      const { room_numbers } = req.body;

      // Basic validation
      if (!room_numbers.length) {
         throw new AppError(
            "Select at least one room",
            HTTP_STATUS.BAD_REQUEST
         );
      }
      // Call service to create room type
      const data = await HotelService.addRoomTypeRooms({
         roomTypeId,
         room_numbers,
      });

      return successResponse(res, {
         message: "Rooms added successfully",
         data,
         statusCode: HTTP_STATUS.CREATED,
      });
   } catch (error) {
      next(error);
   }
};

// Add room type images
export const addRoomTypeImages = async (req, res, next) => {
   try {
      const { roomTypeId } = req.params;
      const { images } = req.body;

      // Basic validation
      if (!images.length) {
         throw new AppError(
            "Select at least one image",
            HTTP_STATUS.BAD_REQUEST
         );
      }
      // Call service to create room type
      const data = await HotelService.addRoomTypeImages({
         roomTypeId,
         images,
      });

      return successResponse(res, {
         message: "Images added successfully",
         data,
         statusCode: HTTP_STATUS.CREATED,
      });
   } catch (error) {
      next(error);
   }
};

// Get hotel by id
export const getHotelById = async (req, res, next) => {
   try {
      const { hotelId } = req.params;
      const data = await HotelService.getHotelById(hotelId);

      return successResponse(res, {
         message: "Hotel fetched successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};
