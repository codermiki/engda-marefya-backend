import { Router } from "express";
import {
   createHotel,
   updateHotel,
   createRoomType,
   addRoomTypeAmenities,
   createAmenity,
   addRoomTypeRooms,
   getHotelById,
   getAmenities,
   getRoomTypesById,
} from "../controller/index.js";

const router = Router();

// Create a new hotel route
router.post("/", createHotel);
// Update hotel info
router.put("/:hotelId", updateHotel);
// Create a new room type for a hotel
router.post("/:hotelId/room-types", createRoomType);
// get room types details
router.get("/room-types/:roomTypeId", getRoomTypesById);
// Create a new amenity
router.post("/amenities", createAmenity);
// get amenities
router.get("/amenities", getAmenities);
// Create a new room type for a hotel
router.post("/room-types/:roomTypeId/add-amenities", addRoomTypeAmenities);
// Add rooms for a room type
router.post("/room-types/:roomTypeId/rooms", addRoomTypeRooms);
// Get hotel by id
router.get("/:hotelId", getHotelById);

export default router;
