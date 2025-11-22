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

   // Update hotel
   static async updateHotel(id, updateData) {
      const allowedFields = [
         "name",
         "location",
         "contact_info",
         "discription",
         "profile_pic_url",
      ];

      const setClause = [];
      const values = [];

      allowedFields.forEach((field) => {
         if (updateData[field] !== undefined) {
            setClause.push(`${field} = ?`);
            values.push(updateData[field]);
         }
      });

      if (setClause.length === 0) {
         throw new AppError(
            "No valid fields to update",
            HTTP_STATUS.BAD_REQUEST
         );
      }

      setClause.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      const query = `UPDATE hotels SET ${setClause.join(", ")} WHERE id = ?`;

      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            throw new AppError(
               "Hotel not found or no changes made",
               HTTP_STATUS.NOT_FOUND
            );
         }
         return { id, ...updateData };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("business_license")) {
               throw new AppError(
                  "Another hotel already exists with this business license",
                  HTTP_STATUS.BAD_REQUEST
               );
            }
         }
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(
            "Internal server error during hotel update",
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

   // get room type by id
   static async getRoomTypeById(id) {
      const query = `
         SELECT
            rt.id,
            rt.hotel_id,
            rt.name,
            rt.description,
            rt.price_per_night,
            rt.main_image_url,
            rt.status,
            rt.created_at,
            rt.updated_at,
            h.name AS hotel_name,
            h.location AS hotel_location,
            h.contact_info,
            h.description AS hotel_description,
            h.profile_pic_url
         FROM room_types AS rt
         JOIN hotels AS h ON rt.hotel_id = h.id
         WHERE rt.id = ?`;
      try {
         const [rows] = await pool.execute(query, [id]);
         if (rows.length === 0) {
            return null;
         }
         return rows[0];
      } catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // update room type
   static async updateRoomType(id, updateData) {
      const allowedFields = [
         "name",
         "description",
         "price_per_night",
         "main_image_url",
         "status",
      ];

      const setClause = [];
      const values = [];

      allowedFields.forEach((field) => {
         if (updateData[field] !== undefined) {
            setClause.push(`${field} = ?`);
            values.push(updateData[field]);
         }
      });

      if (setClause.length === 0) {
         throw new AppError(
            "No valid fields to update",
            HTTP_STATUS.BAD_REQUEST
         );
      }

      setClause.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      const query = `UPDATE room_types SET ${setClause.join(
         ", "
      )} WHERE id = ?`;

      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            throw new AppError(
               "Room type not found or no changes made",
               HTTP_STATUS.NOT_FOUND
            );
         }
         return { id, ...updateData };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("name")) {
               throw new AppError(
                  "Another room type already exists with this name for the hotel",
                  HTTP_STATUS.BAD_REQUEST
               );
            }
         }
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(
            "Internal server error during room type update",
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

   // get amenities
   static async getAmenities() {
      const query = `SELECT id, name, icon_url
        FROM amenities`;
      try {
         const [rows] = await pool.execute(query);
         return rows;
      } catch (error) {
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

   // add room type rooms
   static async addRoomTypeRoom(roomData) {
      const { id, room_type_id, room_number } = roomData;
      const query = `INSERT INTO rooms (id, room_type_id, room_number)
        VALUES (?, ?, ?)`;
      const values = [id, room_type_id, room_number];
      try {
         const [result] = await pool.execute(query, values);
         return roomData;
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
               "Room already added with this room number for the room type",
               HTTP_STATUS.BAD_REQUEST
            );
         }
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // get hotel by id
   static async getHotelById(hotelId) {
      const [hotelRows] = await pool.execute(
         `SELECT id, name, location, contact_info, description, business_license, profile_pic_url, status, owner_id, created_at, updated_at
          FROM hotels
          WHERE id = ?`,
         [hotelId]
      );

      if (hotelRows.length === 0) {
         return null; // Hotel not found
      }

      return hotelRows[0];
   }

   // get hotels roomtypes
   static async getHotelRoomTypes(hotelId, status = null) {
      let query = `SELECT id, name, description, price_per_night, main_image_url, status
          FROM room_types
          WHERE hotel_id = ?`;
      let values = [hotelId];
      if (status !== null) {
         query += " AND status = ?";
         values.push(status);
      }
      // Fetch room types for the hotel
      const [roomTypeRows] = await pool.execute(query, values);

      if (roomTypeRows.length === 0) {
         return null; // No room types found for the hotel
      }

      return roomTypeRows;
   }

   // get room types amenities
   static async getRoomTypeAmenities(roomTypeId) {
      const [amenityRows] = await pool.execute(
         `SELECT a.id, a.name, a.icon_url
          FROM amenities a
          JOIN room_type_amenities rta ON a.id = rta.amenity_id
          WHERE rta.room_type_id = ?`,
         [roomTypeId]
      );

      if (amenityRows.length === 0) {
         return null; // No amenities found for the room type
      }

      return amenityRows;
   }

   // get room types rooms
   static async getRoomTypeRooms(roomTypeId, status = null) {
      let query = `SELECT id, room_number, status
          FROM rooms
          WHERE room_type_id = ?`;
      let values = [roomTypeId];
      if (status !== null) {
         query += " AND status = ?";
         values.push(status);
      }

      const [roomRows] = await pool.execute(query, values);

      if (roomRows.length === 0) {
         return null; // No rooms found for the room type
      }

      return roomRows;
   }

   // Add room type images
   static async addRoomTypeImage(imageData) {
      const { id, room_type_id, image_url, alt_text } = imageData;
      const query = `INSERT INTO room_type_images (id, room_type_id, image_url, alt_text)
        VALUES (?, ?, ?, ?)`;
      const values = [id, room_type_id, image_url, alt_text];
      try {
         const [result] = await pool.execute(query, values);
         return { ...imageData };
      } catch (error) {
         if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
               "Room type image already added with this image url for the room type",
               HTTP_STATUS.BAD_REQUEST
            );
         }
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // get room types images
   static async getRoomTypeImages(roomTypeId) {
      const query = `SELECT id, image_url, alt_text
          FROM room_type_images
          WHERE room_type_id = ?`;
      const values = [roomTypeId];
      const [imageRows] = await pool.execute(query, values);
      if (imageRows.length === 0) {
         return null; // No images found for the room type
      }

      return imageRows;
   }
}

export default HotelModel;
