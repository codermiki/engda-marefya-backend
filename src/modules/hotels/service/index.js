import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";
import { generateId } from "../../../utils/idGenerator.js";
import HotelModel from "../model/HotelModel.js";

export class HotelService {
   // Create hotel
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

   // Update hotel
   static async updateHotel(hotelId, updateData) {
      try {
         const updatedHotel = await HotelModel.updateHotel(hotelId, updateData);

         if (!updatedHotel) {
            throw new AppError("Hotel not found.", HTTP_STATUS.NOT_FOUND);
         }

         return updatedHotel;
      } catch (error) {
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to update hotel. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Create room type
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

   // Get room type by id
   static async getRoomTypeById(roomTypeId) {
      try {
         let roomType = await HotelModel.getRoomTypeById(roomTypeId);
         let rooms = await HotelModel.getRoomTypeRooms(roomTypeId);
         let amenities = await HotelModel.getRoomTypeAmenities(roomTypeId);
         let images = await HotelModel.getRoomTypeImages(roomTypeId);

         // Check if room type exists
         if (!roomType) {
            roomType = [];
         }

         // Check if rooms exist
         if (!rooms) {
            rooms = [];
         }

         // Check if amenities exist
         if (!amenities) {
            amenities = [];
         }

         // Check if images exist
         if (!images) {
            images = [];
         }

         return {
            id: roomType.id,
            name: roomType.name,
            description: roomType.description,
            price_per_night: roomType.price_per_night,
            main_image_url: roomType.main_image_url,
            status: roomType.status,
            hotel: {
               id: roomType.hotel_id,
               name: roomType.hotel_name,
               location: roomType.hotel_location,
               contact_info: roomType.contact_info,
               description: roomType.hotel_description,
               profile_pic_url: roomType.profile_pic_url,
            },
            images: images
               ? images.map((image) => ({
                    id: image.id,
                    image_url: image.image_url,
                    alt_text: image.alt_text,
                 }))
               : [],
            amenities: amenities
               ? amenities.map((amenity) => ({
                    id: amenity.id,
                    name: amenity.name,
                    icon_url: amenity.icon_url,
                 }))
               : [],
            rooms: rooms
               ? rooms.map((room) => ({
                    id: room.id,
                    room_number: room.room_number,
                    status: room.status,
                 }))
               : [],
            available_rooms_count: rooms.length,
            created_at: roomType.created_at,
            updated_at: roomType.updated_at,
         };
      } catch (error) {
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to retrieve room type. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // update room type
   static async updateRoomType(roomTypeId, updateData) {
      try {
         const updatedRoomType = await HotelModel.updateRoomType(
            roomTypeId,
            updateData
         );

         if (!updatedRoomType) {
            throw new AppError("Room type not found.", HTTP_STATUS.NOT_FOUND);
         }

         return updatedRoomType;
      } catch (error) {
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to update room type. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Create amenity
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

   // Get amenities
   static async getAmenities() {
      try {
         const amenities = await HotelModel.getAmenities();
         return amenities;
      } catch (error) {
         throw new AppError(
            "Failed to get amenities. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Add room type amenities
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

   // Add room type rooms
   static async addRoomTypeRooms({ roomTypeId, room_numbers }) {
      try {
         let rooms = [];
         if (room_numbers.length) {
            const promises = room_numbers.map(async (room_number) => {
               // Generate Object Id
               const id = generateId();
               const newRoom = await HotelModel.addRoomTypeRoom({
                  id,
                  room_type_id: roomTypeId,
                  room_number,
               });
               return newRoom.id;
            });

            rooms = await Promise.all(promises);
         }

         return { rooms };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to add room type rooms. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Add room type images
   static async addRoomTypeImages({ roomTypeId, images }) {
      try {
         let newImages = [];
         if (images.length) {
            const promises = images.map(async (image) => {
               // Generate Object Id
               const id = generateId();
               const newImage = await HotelModel.addRoomTypeImage({
                  id,
                  room_type_id: roomTypeId,
                  image_url: image.image_url,
                  alt_text: image.alt_text,
               });
               return newImage;
            });

            newImages = await Promise.all(promises);
         }

         return { images: newImages };
      } catch (error) {
         // Re-throw AppError instances, otherwise wrap in AppError
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to add room type images. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get hotel by id
   static async getHotelById(hotelId) {
      try {
         const hotel = await HotelModel.getHotelById(hotelId);

         if (!hotel) {
            throw new AppError("Hotel not found.", HTTP_STATUS.NOT_FOUND);
         }

         let roomTypesData = await HotelModel.getHotelRoomTypes(hotelId);

         if (!roomTypesData) {
            roomTypesData = [];
         }

         const roomTypesWithDetails = await Promise.all(
            roomTypesData.map(async (roomType) => {
               let amenities = await HotelModel.getRoomTypeAmenities(
                  roomType.id
               );
               let rooms = await HotelModel.getRoomTypeRooms(roomType.id);

               if (!amenities) {
                  amenities = [];
               }

               if (!rooms) {
                  rooms = [];
               }

               return {
                  id: roomType.id,
                  name: roomType.name,
                  description: roomType.description,
                  price_per_night: roomType.price_per_night,
                  main_image_url: roomType.main_image_url,
                  status: roomType.status,
                  amenities: amenities.map((a) => a.name),
                  available_rooms: rooms.length,
               };
            })
         );

         return {
            id: hotel.id,
            name: hotel.name,
            location: hotel.location,
            contact_info: hotel.contact_info,
            description: hotel.description,
            business_license: hotel.business_license,
            profile_pic_url: hotel.profile_pic_url,
            status: hotel.status,
            owner_id: hotel.owner_id,
            room_types: roomTypesWithDetails,
            created_at: hotel.created_at,
            updated_at: hotel.updated_at,
         };
      } catch (error) {
         console.log(error);
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to retrieve hotel details. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}
