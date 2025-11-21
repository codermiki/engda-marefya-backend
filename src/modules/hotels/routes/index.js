import { Router } from "express";
import {
   createHotel,
   createRoomType,
   addRoomTypeAmenities,
   createAmenity,
} from "../controller/index.js";

const router = Router();

// Create a new hotel route
router.post("/", createHotel);
// Create a new room type for a hotel
router.post("/:hotelId/room-types", createRoomType);
// Create a new amenity
router.post("/amenities", createAmenity);
// Create a new room type for a hotel
router.post("/room-types/:roomTypeId/add-amenities", addRoomTypeAmenities);

export default router;
