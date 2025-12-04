import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controller/index.js";
import { updateUserProfileValidation } from "../../../middlewares/validation.js";
import {
   verifyToken,
   requireUserOwnership,
} from "../../../middlewares/authMiddleware.js";

const router = Router();

// Get user profile route
router.get(
   "/:id",
   verifyToken,
   requireUserOwnership(["admin"]),
   getUserProfile
);

// Update user profile route
router.put(
   "/:id",
   verifyToken,
   requireUserOwnership(["admin"]),
   updateUserProfileValidation,
   updateUserProfile
);

export default router;
