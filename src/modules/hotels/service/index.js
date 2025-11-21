import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import { generateId } from "../../../utils/idGenerator.js";
import HotelModel from "../model/HotelModel.js";

export class HotelService {
   static async createHotel({
      owner_id,
      name,
      location,
      contact_info,
      description,
      business_license,
      profile_pic_url,
   }) {
      try {
         // Generate Object Id
         const id = generateId();

         const newHotel = await HotelModel.create({
            id,
            owner_id,
            name,
            location,
            contact_info,
            description,
            business_license,
            profile_pic_url,
         });

         return {
            id: newHotel.id,
            owner_id: newHotel.owner_id,
            name: newHotel.name,
            location: newHotel.location,
            contact_info: newHotel.contact_info,
            description: newHotel.description,
            business_license: newHotel.business_license,
            profile_pic_url: newHotel.profile_pic_url,
            created_at: newHotel.created_at,
            updated_at: newHotel.updated_at,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to create hotel. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   static async createRoomType({
      hotelId,
      name,
      description,
      price_per_night,
      main_image_url,
   }) {
      try {
         // Generate Object Id
         const id = generateId();

         const newRoomType = await HotelModel.createRoomType({
            id,
            hotel_id: hotelId,
            name,
            description,
            price_per_night,
            main_image_url,
         });

         return {
            id: newRoomType.id,
            hotelId: newRoomType.hotelId,
            name: newRoomType.name,
            description: newRoomType.description,
            price_per_night: newRoomType.price_per_night,
            main_image_url: newRoomType.main_image_url,
            amenity_ids: newRoomType.amenity_ids,
            created_at: newRoomType.created_at,
            updated_at: newRoomType.updated_at,
         };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to create room type. Please try again.",
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

   static async addRoomTypeAmenities({ roomTypeId, amenity_ids }) {
      try {
         let amenities = [];
         if (amenity_ids.length) {
            const promises = amenity_ids.map(async (amenity_id) => {
               // Generate Object Id
               const id = generateId();
               const newAmenity = await HotelModel.addRoomTypeAmenity({
                  id,
                  room_type_id: roomTypeId,
                  amenity_id,
               });
               return newAmenity.id;
            });

            amenities = await Promise.all(promises);
         }

         return { amenities };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to add room type amenities. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
