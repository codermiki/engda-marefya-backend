import express from "express";
import cors from "cors";
import requestLogger from "./middlewares/requestLogger.js";

const app = express();

// ====== Global Middlewares ======
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Enable "trust proxy" if using Nginx or reverse proxy
app.set("trust proxy", true);

// ====== Custom Request Logger ======
app.use(requestLogger);

// ====== Health Check Route ======
app.use("/api/v1/health", (req, res) => {
   res.status(200).json({
      status: "healthy",
      server: process.env.SERVER_NAME,
   });
});

// ====== 404 Fallback ======
app.use((req, res) => {
   res.status(404).json({ error: "Not Found" });
});

// Export the configured Express application instance.
export default app;
