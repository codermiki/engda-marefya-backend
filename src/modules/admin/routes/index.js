import { Router } from "express";
import {
   getAllUsers,
   updateUserStatus,
   removeUser,
   createAmenity,
   updateAmenity,
   removeAmenity,
   createAdmin,
} from "../controller/index.js";
import {
   verifyToken,
   requireRole,
} from "../../../middlewares/authMiddleware.js";
import {
   handleValidationErrors,
   registerValidation,
   updateAmenityValidation,
   updateUserStatusValidation,
} from "../../../middlewares/validation.js";

const router = Router();

// Create admin route
router.post(
   "/",
   verifyToken,
   // requireRole(["admin"]),
   registerValidation,
   handleValidationErrors,
   createAdmin
);
// Get users route
router.get("/users", verifyToken, requireRole(["admin"]), getAllUsers);
// Update user profile route
router.put(
   "/users/:id/status",
   verifyToken,
   requireRole(["admin"]),
   updateUserStatusValidation,
   handleValidationErrors,
   updateUserStatus
);
// Remove user route
router.delete("/users/:id", verifyToken, requireRole(["admin"]), removeUser);
// Create a new amenity
router.post("/amenities", verifyToken, requireRole(["admin"]), createAmenity);
// Update amenity
router.put(
   "/amenities/:id",
   verifyToken,
   requireRole(["admin"]),
   updateAmenityValidation,
   updateAmenity
);
// Remove amenity
router.delete(
   "/amenities/:id",
   verifyToken,
   requireRole(["admin"]),
   removeAmenity
);

export default router;
