import { Router } from "express";
import { getUsers, updateUserStatus, removeUser } from "../controller/index.js";

const router = Router();

// Get users route
router.get("/users", getUsers);
// Update user profile route
router.put("/users/:id/:status", updateUserStatus);
// Remove user route
router.delete("/users/:id", removeUser);

export default router;
