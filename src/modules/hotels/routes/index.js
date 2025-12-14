import { Router } from "express";
import {
   createHotel,
   updateHotel,
   createRoomType,
   addRoomTypeAmenities,
   addRoomTypeRooms,
   addRoomTypeImages,
   getHotelById,
   getAmenities,
   getRoomTypesById,
   updateRoomType,
   getHotelsByOwnerId,
   updateRoomTypeRoomStatus,
   deleteRoomTypeImage,
   getAllHotels,
   getAllRoomTypes,
   getAvailableRooms,
   checkIfRoomTypeInWishlist,
   toggleWishlist,
   getRoomTypeReviews,
} from "../controller/index.js";
import {
   verifyToken,
   requireRole,
   requireUserOwnership,
   requireHotelOwnership,
   requireRoomTypeOwnership,
} from "../../../middlewares/authMiddleware.js";
import {
   addRoomTypeAmenitiesValidation,
   addRoomTypeImagesValidation,
   addRoomTypeRoomsValidation,
   createHotelValidation,
   createRoomTypeValidation,
   handleValidationErrors,
   updateHotelValidation,
   updateRoomTypeRoomStatusValidation,
   updateRoomTypeValidation,
} from "../../../middlewares/validation.js";

const router = Router();

// Get all hotels with pagination and search
router.get("/", getAllHotels);

// Get amenities
router.get(
   "/amenities",
   verifyToken,
   requireRole(["hotel_owner", "admin"]),
   getAmenities
);

// Get room types with filter, pagination and search
router.get("/room-types", getAllRoomTypes);

// Create a new hotel route
router.post(
   "/",
   verifyToken,
   requireRole(["hotel_owner"]),
   createHotelValidation,
   handleValidationErrors,
   createHotel
);

// Update hotel info
router.put(
   "/:id",
   verifyToken,
   requireRole(["hotel_owner"]),
   requireHotelOwnership(["admin"]),
   updateHotelValidation,
   updateHotel
);

// Get hotel by id
router.get("/:id", getHotelById);

// Get hotel by owner id
router.get(
   "/owner/:id",
   verifyToken,
   requireUserOwnership(["admin"]),
   getHotelsByOwnerId
);

// Create a new room type for a hotel
router.post(
   "/:id/room-types",
   verifyToken,
   requireRole(["hotel_owner"]),
   createRoomTypeValidation,
   handleValidationErrors,
   createRoomType
);

// Update room type
router.put(
   "/room-types/:id",
   verifyToken,
   requireRole(["hotel_owner"]),
   requireRoomTypeOwnership(["admin"]),
   updateRoomTypeValidation,
   updateRoomType
);

// Get room type details
router.get("/room-types/:id", getRoomTypesById);

// Get available rooms for a room type
router.get("/room-types/:id/available-rooms", getAvailableRooms);

// Add or remove room type to wishlist
router.post("/room-types/:id/wishlist", verifyToken, toggleWishlist);

// Is room type in wishlist
router.get("/room-types/:id/wishlist", verifyToken, checkIfRoomTypeInWishlist);

// Get reviews for a room type
router.get("/room-types/:id/reviews", getRoomTypeReviews);

// Add amenities to a room type
router.post(
   "/room-types/:id/add-amenities",
   verifyToken,
   requireRole(["hotel_owner"]),
   requireRoomTypeOwnership(["admin"]),
   addRoomTypeAmenitiesValidation,
   handleValidationErrors,
   addRoomTypeAmenities
);

// Add rooms for a room type
router.post(
   "/room-types/:id/rooms",
   verifyToken,
   requireRole(["hotel_owner"]),
   requireRoomTypeOwnership(["admin"]),
   addRoomTypeRoomsValidation,
   handleValidationErrors,
   addRoomTypeRooms
);

// Add room type images
router.post(
   "/room-types/:id/images",
   verifyToken,
   requireRole(["hotel_owner"]),
   requireRoomTypeOwnership(["admin"]),
   addRoomTypeImagesValidation,
   handleValidationErrors,
   addRoomTypeImages
);

// Update rooms status
router.put(
   "/room-types/:id/rooms/:roomId",
   verifyToken,
   requireRole(["hotel_owner"]),
   requireRoomTypeOwnership(["admin"]),
   updateRoomTypeRoomStatusValidation,
   handleValidationErrors,
   updateRoomTypeRoomStatus
);

// Delete image from a room type
router.delete(
   "/room-types/:id/images/:imageId",
   verifyToken,
   requireRole(["hotel_owner"]),
   requireRoomTypeOwnership(["admin"]),
   deleteRoomTypeImage
);

export default router;
