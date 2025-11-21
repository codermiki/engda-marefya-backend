import pool from "../../../config/db.js";
import { HTTP_STATUS } from "../../../constants/http.js";
import AppError from "../../../utils/AppError.js";

class HotelModel {
   // Create a new hotel
   static async create(hotelData) {
      const {
         id,
         owner_id,
         name,
         location,
         contact_info,
         description,
         business_license,
         profile_pic_url,
      } = hotelData;
      const query = `INSERT INTO hotels (id, owner_id, name, location, contact_info, description, business_license, profile_pic_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
         id,
         owner_id,
         name,
         location,
         contact_info,
         description,
         business_license,
         profile_pic_url,
      ];

      try {
         const [result] = await pool.execute(query, values);
         return { id, ...hotelData };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("business_license")) {
               throw new AppError(
                  "Hotel already exists with this business license",
                  HTTP_STATUS.BAD_REQUEST
               );
            }
         }
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
   // Create room type for a hotel
   static async createRoomType(roomTypeData) {
      const {
         id,
         hotel_id,
         name,
         description,
         price_per_night,
         main_image_url,
      } = roomTypeData;

      const query = `INSERT INTO room_types (id, hotel_id, name, description, price_per_night, main_image_url)
        VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [
         id,
         hotel_id,
         name,
         description,
         price_per_night,
         main_image_url,
      ];
      try {
         const [result] = await pool.execute(query, values);
         return { ...roomTypeData };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("name")) {
               throw new AppError(
                  "Room type already exists with this name for the hotel",
                  HTTP_STATUS.BAD_REQUEST
               );
            }
         }
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
   // Create Amenities
   static async createAmenity(amenityData) {
      const { id, name, icon_url } = amenityData;

      const query = `INSERT INTO amenities (id, name, icon_url)
        VALUES (?, ?, ?)`;
      const values = [id, name, icon_url];
      try {
         const [result] = await pool.execute(query, values);
         return { ...amenityData };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("name")) {
               throw new AppError(
                  "Amenity already exists with this name",
                  HTTP_STATUS.BAD_REQUEST
               );
            }
         }
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
   // add room type amenities
   static async addRoomTypeAmenity(amenityData) {
      const { id, room_type_id, amenity_id } = amenityData;
      const query = `INSERT INTO room_type_amenities (id, room_type_id, amenity_id)
        VALUES (?, ?, ?)`;
      const values = [id, room_type_id, amenity_id];
      try {
         const [result] = await pool.execute(query, values);
         return amenityData;
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
               "Room type amenities already added with this name for the room type",
               HTTP_STATUS.BAD_REQUEST
            );
         }
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }
}

export default HotelModel;
