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
      const { id } = req.params;
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
         throw new AppError("No update data provided", HTTP_STATUS.BAD_REQUEST);
      }

      const data = await HotelService.updateHotel(id, updateData);

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
      const id = req?.params?.id;
      const {
         name,
         description,
         price_per_night,
         main_image_url,
         bed_type,
         number_of_beds,
      } = req.body;

      if (!id) {
         throw new AppError("Hotel ID is required", HTTP_STATUS.BAD_REQUEST);
      }

      const data = await HotelService.createRoomType({
         hotelId: id,
         name,
         description,
         price_per_night,
         main_image_url,
         bed_type,
         number_of_beds,
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
      const { id } = req.params;
      const data = await HotelService.getRoomTypeById(id);

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
      const { id } = req.params;
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
         throw new AppError("No update data provided", HTTP_STATUS.BAD_REQUEST);
      }

      const data = await HotelService.updateRoomType(id, updateData);

      return successResponse(res, {
         message: "Room type updated successfully",
         data,
         statusCode: HTTP_STATUS.OK,
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
      const { id } = req.params;
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
         roomTypeId: id,
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
      const { id } = req.params;
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
         roomTypeId: id,
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
      const { id } = req.params;
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
         roomTypeId: id,
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
      const { id } = req.params;
      const data = await HotelService.getHotelById(id);

      return successResponse(res, {
         message: "Hotel fetched successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Get hotel by owner id
export const getHotelsByOwnerId = async (req, res, next) => {
   try {
      const { id } = req.params;
      const data = await HotelService.getHotelsByOwnerId(id);

      return successResponse(res, {
         message: "Hotels fetched successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Update room type room status
export const updateRoomTypeRoomStatus = async (req, res, next) => {
   try {
      const { roomId } = req.params;
      const updateData = req.body;

      if (!roomId) {
         throw new AppError("Room id is required", HTTP_STATUS.BAD_REQUEST);
      }
      if (!Object.keys(updateData).length) {
         throw new AppError("Update data is required", HTTP_STATUS.BAD_REQUEST);
      }
      // Call service to create room type
      const data = await HotelService.updateRoomTypeRoomStatus(
         roomId,
         updateData.status
      );

      return successResponse(res, {
         message: "Room status updated successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Delete image from a room type
export const deleteRoomTypeImage = async (req, res, next) => {
   try {
      const { imageId } = req.params;
      const data = await HotelService.deleteRoomTypeImage(imageId);

      return successResponse(res, {
         message: "Image deleted successfully",
         data,
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Get all hotels with pagination and search
export const getAllHotels = async (req, res, next) => {
   try {
      const search = req?.query?.search;
      const page = req?.query?.page;
      const limit = req?.query?.limit;

      const { hotels, pagination } = await HotelService.getAllHotels(
         search,
         page,
         limit
      );

      return successResponse(res, {
         message: "Hotels fetched successfully",
         data: { hotels, pagination },
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};

// Get all room types with filter, pagination and search
export const getAllRoomTypes = async (req, res, next) => {
   try {
      const search = req?.query?.search;
      const minPrice = req?.query?.minPrice;
      const maxPrice = req?.query?.maxPrice;
      const bedType = req?.query?.bedType;
      const numberOfBeds = req?.query?.numberOfBeds;
      const page = req?.query?.page;
      const limit = req?.query?.limit;

      const { roomTypes, pagination } = await HotelService.getAllRoomTypes(
         search,
         minPrice,
         maxPrice,
         bedType,
         numberOfBeds,
         page,
         limit
      );

      return successResponse(res, {
         message: "Room types fetched successfully",
         data: { roomTypes, pagination },
         statusCode: HTTP_STATUS.OK,
      });
   } catch (error) {
      next(error);
   }
};
