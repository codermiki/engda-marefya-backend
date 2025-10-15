import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { errorResponse, successResponse } from "./utils/responseFormatter.js";
import { ERROR_CODES } from "./constants/errors.js";
import { HTTP_STATUS } from "./constants/http.js";

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

// ====== 404 Fallback ======
app.use((req, res) => {
   errorResponse(res, {
      error: ERROR_CODES.NOT_FOUND,
      message: "Route Not Found",
      statusCode: HTTP_STATUS.NOT_FOUND,
   });
});

// Export the configured Express application instance.
export default app;
