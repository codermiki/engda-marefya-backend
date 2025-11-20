import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import { successResponse } from "./utils/responseFormatter.js";
import { HTTP_STATUS } from "./constants/http.js";
import AppError from "./utils/AppError.js";
import authRoutes from "./modules/auth/routes/index.js";
import usersRoutes from "./modules/users/routes/index.js";
import adminRoutes from "./modules/admin/routes/index.js";

const app = express();

// ====== Global Middlewares ======
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.set("trust proxy", 1); // Enable "trust proxy" if using Nginx or reverse proxy
app.use(requestLogger);

// ====== Global Rate Limiter ======
app.use(rateLimiter());

// ====== Health Check Route ======
app.use("/api/v1/health", (req, res) => {
   successResponse(res, {
      message: "healthy",
   });
});

// ====== Api Routes ======
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/admin", adminRoutes);

// ====== 404 Fallback ======
app.use((req, res) => {
   throw new AppError("Route Not Found", HTTP_STATUS.NOT_FOUND);
});

// Global error handler (must be last)
app.use(errorHandler);

// Handle uncaught exceptions (sync code)
process.on("uncaughtException", (err) => {
   logger.error("UNCAUGHT EXCEPTION 💥 Shutting down...");
   logger.error(err);
   process.exit(1); // crash to restart in stable state
});

// Handle unhandled promise rejections (async code)
process.on("unhandledRejection", (err) => {
   logger.error("UNHANDLED REJECTION 💥 Shutting down...");
   logger.error(err);
   process.exit(1); // crash to restart in stable state
});

// Export the configured Express application instance.
export default app;
