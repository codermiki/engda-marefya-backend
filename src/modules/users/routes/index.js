import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controller/index.js";

const router = Router();

// Get user profile route
router.get("/:id", getUserProfile);

// Update user profile route
router.put("/:id", updateUserProfile);

export default router;
