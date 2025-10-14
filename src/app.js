import express from "express";
import cors from "cors";

const app = express();

// ====== Middlewares ======
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// ====== Health Check Route ======
app.use("/api/v1/health", (req, res) => {
   res.status(200).json({
      status: "healthy",
      server: process.env.SERVER_NAME,
   });
});

// Export the configured Express application instance.
export default app;
