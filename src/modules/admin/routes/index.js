import { Router } from "express";
import {
   getAllUsers,
   updateUserStatus,
   removeUser,
   createAmenity,
   updateAmenity,
   removeAmenity,
   createAdmin,
   getAdminDashboardData,
   updateUserRole,
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
   updateUserRoleValidation,
} from "../../../middlewares/validation.js";
import { USER_ROLES } from "../../../constants/user.js";

const router = Router();

// Create admin route
router.post(
   "/",
   verifyToken,
   // requireRole([USER_ROLES.SUPER_ADMIN]),
   registerValidation,
   handleValidationErrors,
   createAdmin
);
// Get users route
router.get(
   "/users",
   verifyToken,
   // requireRole([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   getAllUsers
);
// Activate/Deactivate user route
router.put(
   "/users/:id/status",
   verifyToken,
   // requireRole([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   updateUserStatusValidation,
   handleValidationErrors,
   updateUserStatus
);

// Update user role
router.put(
   "/users/:id/role",
   verifyToken,
   // requireRole([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   updateUserRoleValidation,
   handleValidationErrors,
   updateUserRole
);
// Remove user route
router.delete(
   "/users/:id",
   verifyToken,
   // requireRole([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   removeUser
);
// Create a new amenity
router.post(
   "/amenities",
   verifyToken,
   // requireRole([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   createAmenity
);
// Update amenity
router.put(
   "/amenities/:id",
   verifyToken,
   // requireRole([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   updateAmenityValidation,
   updateAmenity
);
// Remove amenity
router.delete(
   "/amenities/:id",
   verifyToken,
   // requireRole([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   removeAmenity
);
// Get admin dashboard data
router.get(
   "/dashboard/data",
   verifyToken,
   requireRole([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]),
   getAdminDashboardData
);

export default router;
