import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controller/index.js";
import { updateUserProfileValidation } from "../../../middlewares/validation.js";
import {
   verifyToken,
   requireUserOwnership,
} from "../../../middlewares/authMiddleware.js";
import { USER_ROLES } from "../../../constants/user.js";

const router = Router();

// Get user profile route
router.get(
   "/:id",
   verifyToken,
   requireUserOwnership([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   getUserProfile
);

// Update user profile route
router.put(
   "/:id",
   verifyToken,
   requireUserOwnership([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   updateUserProfileValidation,
   updateUserProfile
);

export default router;
