import "dotenv/config";

// Import the configured Express app
import app from "./app.js";

// ====== Server configuration ======
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 9000;
const SERVER_NAME = process.env.SERVER_NAME || "Engda Marefya API";

// ====== Start the server ======
app.listen(PORT, "0.0.0.0", (error) => {
   if (!error) {
      console.log(`==> ${SERVER_NAME} running on http://${HOST}:${PORT}`);
      console.log(`==> Check health on http://${HOST}:${PORT}/api/v1/health`);
   }
});
