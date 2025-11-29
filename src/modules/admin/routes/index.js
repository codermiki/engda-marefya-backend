import { Router } from "express";
import {
   getUsers,
   updateUserStatus,
   removeUser,
   createAmenity,
   // updateAmenity,
   // removeAmenity,
} from "../controller/index.js";
import {
   verifyToken,
   requireRole,
} from "../../../middlewares/authMiddleware.js";

const router = Router();

// Get users route
router.get("/users", verifyToken, requireRole(["admin"]), getUsers);
// Update user profile route
router.put(
   "/users/:id/:status",
   verifyToken,
   requireRole(["admin"]),
   updateUserStatus
);
// Remove user route
router.delete("/users/:id", verifyToken, requireRole(["admin"]), removeUser);
// Create a new amenity
router.post("/amenities", verifyToken, requireRole(["admin"]), createAmenity);
// Update amenity
// router.put(
//    "/amenities/:id",
//    verifyToken,
//    requireRole(["admin"]),
//    updateAmenity
// );
// // Remove amenity
// router.delete(
//    "/amenities/:id",
//    verifyToken,
//    requireRole(["admin"]),
//    removeAmenity
// );

export default router;
