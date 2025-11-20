import { Router } from "express";
import { getUsers, updateUserStatus } from "../controller/index.js";

const router = Router();

// Get users route
router.get("/users", getUsers);

// Update user profile route
router.put("/users/:id/:status", updateUserStatus);

export default router;
