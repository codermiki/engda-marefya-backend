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
         if (result.affectedRows === 0) {
            return null;
         }

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
         bed_type,
         number_of_beds,
      } = roomTypeData;
      const query = `INSERT INTO room_types (id, hotel_id, name, description, price_per_night, main_image_url, bed_type, number_of_beds)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
         id,
         hotel_id,
         name,
         description,
         price_per_night,
         main_image_url,
         bed_type,
         number_of_beds,
      ];
      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            return null;
         }

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
            rt.bed_type,
            rt.number_of_beds,
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
            return null;
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
         if (result.affectedRows === 0) {
            return null;
         }

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
         if (result.affectedRows === 0) {
            return null;
         }

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
         if (result.affectedRows === 0) {
            return null;
         }

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
         return null;
      }

      return hotelRows[0];
   }

   // get hotels room types
   static async getHotelRoomTypes(hotelId, status = null) {
      let query = `SELECT id, name, description, price_per_night, main_image_url, status
          FROM room_types
          WHERE hotel_id = ?`;
      let values = [hotelId];
      if (status !== null) {
         query += " AND status = ?";
         values.push(status);
      }
      try {
         // Fetch room types for the hotel
         const [roomTypeRows] = await pool.execute(query, values);

         return roomTypeRows;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // get room types amenities
   static async getRoomTypeAmenities(roomTypeId) {
      const query = `SELECT a.id, a.name, a.icon_url
          FROM amenities a
          JOIN room_type_amenities rta ON a.id = rta.amenity_id
          WHERE rta.room_type_id = ?`;
      const values = [roomTypeId];
      try {
         const [amenityRows] = await pool.execute(query, values);

         return amenityRows;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
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
      try {
         const [roomRows] = await pool.execute(query, values);

         return roomRows;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Add room type images
   static async addRoomTypeImage(imageData) {
      const { id, room_type_id, image_url, alt_text } = imageData;
      const query = `INSERT INTO room_type_images (id, room_type_id, image_url, alt_text)
        VALUES (?, ?, ?, ?)`;
      const values = [id, room_type_id, image_url, alt_text];
      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            return null;
         }

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
      try {
         const [imageRows] = await pool.execute(query, values);

         return imageRows;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get hotels by owner id
   static async getHotelsByOwnerId(ownerId) {
      const query = `SELECT id, owner_id, name, location, contact_info, description, business_license, profile_pic_url
          FROM hotels
          WHERE owner_id = ?`;
      const values = [ownerId];
      try {
         const [hotelRows] = await pool.execute(query, values);
         if (hotelRows.length === 0) {
            return null; // No hotels found for the owner
         }

         return hotelRows;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Update room type room status
   static async updateRoomTypeRoomStatus({ room_id, status }) {
      if (!["available", "booked", "maintenance"].includes(status)) {
         throw new AppError(
            "Invalid status. Status must be 'available', 'booked' or 'maintenance'.",
            HTTP_STATUS.BAD_REQUEST
         );
      }

      const query = `UPDATE rooms SET status = ? WHERE id = ?`;
      const values = [status, room_id];
      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            return null;
         }

         return { room_id, status };
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Delete image from a room type
   static async deleteRoomTypeImage(imageId) {
      const query = `DELETE FROM room_type_images WHERE id = ?`;
      const values = [imageId];
      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            return null;
         }

         return { imageId };
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get all hotels
   static async getAllHotels(search, page, limit) {
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, owner_id, name, location, contact_info, description, business_license, profile_pic_url
        FROM hotels
    `;

      const values = [];

      if (search) {
         query += ` WHERE name LIKE ? OR location LIKE ? OR description LIKE ?`;
         values.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

      try {
         const [hotelRows] = await pool.execute(query, values);

         if (hotelRows.length === 0) {
            return null;
         }

         return hotelRows;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Count all hotels with search
   static async countAllHotels(search) {
      let query = `SELECT COUNT(*) as count FROM hotels`;
      const values = [];

      if (search) {
         query += ` WHERE name LIKE ? OR location LIKE ? OR description LIKE ?`;
         values.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      try {
         const [hotelRows] = await pool.execute(query, values);

         if (hotelRows.length === 0) {
            return 0;
         }

         return hotelRows[0].count;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Get all room types with filter, pagination and search
   static async getAllRoomTypes(
      search,
      minPrice,
      maxPrice,
      bedType,
      numberOfBeds,
      page,
      limit
   ) {
      const offset = (page - 1) * limit;
      let query = `
         SELECT rt.*, h.name AS hotel_name, h.location AS hotel_location
         FROM room_types rt
         JOIN hotels h ON rt.hotel_id = h.id
      `;
      const values = [];
      const conditions = [];

      if (search) {
         conditions.push(`(h.location LIKE ? OR h.name LIKE ?)`);
         values.push(`%${search}%`, `%${search}%`);
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
         conditions.push(`rt.price_per_night BETWEEN ? AND ?`);
         values.push(minPrice, maxPrice);
      } else if (minPrice !== undefined) {
         conditions.push(`rt.price_per_night >= ?`);
         values.push(minPrice);
      } else if (maxPrice !== undefined) {
         conditions.push(`rt.price_per_night <= ?`);
         values.push(maxPrice);
      }

      if (bedType) {
         conditions.push(`rt.bed_type = ?`);
         values.push(bedType);
      }

      if (numberOfBeds !== undefined) {
         conditions.push(`rt.number_of_beds = ?`);
         values.push(numberOfBeds);
      }

      if (conditions.length > 0) {
         query += ` WHERE ` + conditions.join(` AND `);
      }

      query += ` AND rt.status = 'active' LIMIT ${Number(
         limit
      )} OFFSET ${Number(offset)}`;

      try {
         const [roomTypeRows] = await pool.execute(query, values);

         return roomTypeRows;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Count all room types with filter, pagination and search
   static async countAllRoomTypes(
      search,
      minPrice,
      maxPrice,
      bedType,
      numberOfBeds
   ) {
      let query = `
         SELECT COUNT(*) AS count
         FROM room_types rt
         JOIN hotels h ON rt.hotel_id = h.id
      `;
      const values = [];
      const conditions = [];

      if (search) {
         conditions.push(`(h.location LIKE ? OR h.name LIKE ?)`);
         values.push(`%${search}%`, `%${search}%`);
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
         conditions.push(`rt.price_per_night BETWEEN ? AND ?`);
         values.push(minPrice, maxPrice);
      } else if (minPrice !== undefined) {
         conditions.push(`rt.price_per_night >= ?`);
         values.push(minPrice);
      } else if (maxPrice !== undefined) {
         conditions.push(`rt.price_per_night <= ?`);
         values.push(maxPrice);
      }

      if (bedType) {
         conditions.push(`rt.bed_type = ?`);
         values.push(bedType);
      }

      if (numberOfBeds !== undefined) {
         conditions.push(`rt.number_of_beds = ?`);
         values.push(numberOfBeds);
      }

      if (conditions.length > 0) {
         query += ` WHERE ` + conditions.join(` AND `);
      }

      query += ` AND rt.status = 'active'`;

      try {
         const [roomTypeRows] = await pool.execute(query, values);

         if (roomTypeRows.length === 0) {
            return 0;
         }

         return roomTypeRows[0].count;
      } catch (error) {
         throw new AppError(
            "Internal server error",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Update amenities
   static async updateAmenity(id, updateData) {
      const allowedFields = ["name", "icon_url"];

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

      const query = `UPDATE amenities SET ${setClause.join(", ")} WHERE id = ?`;

      try {
         const [result] = await pool.execute(query, values);
         if (result.affectedRows === 0) {
            return null;
         }

         return {
            id,
            ...updateData,
         };
      } catch (error) {
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to update amenities. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // Delete amenities
   static async removeAmenity(id) {
      const query = `DELETE FROM amenities WHERE id = ?`;

      try {
         const [result] = await pool.execute(query, [id]);
         if (result.affectedRows === 0) {
            return null;
         }

         return { id };
      } catch (error) {
         if (error instanceof AppError) {
            throw error;
         }

         throw new AppError(
            "Failed to delete amenities. Please try again.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
         );
      }
   }

   // get room price
   static async getRoomPrice(roomId) {
      // join with rooms table to get room_type_id
      const query = `
         SELECT rt.price_per_night
         FROM room_types rt
         JOIN rooms r ON rt.id = r.room_type_id
         WHERE r.id = ?`;
      try {
         const [rows] = await pool.execute(query, [roomId]);
         if (rows.length === 0) {
            throw new AppError("Room not found", HTTP_STATUS.NOT_FOUND);
         }
         return rows[0].price_per_night;
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
}

export default HotelModel;
