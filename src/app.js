import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import guestsRoutes from "./routes/guests.routes.js";
import giftsRoutes from "./routes/gifts.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// RUTAS
app.use("/api/guests", guestsRoutes);
app.use("/api/gifts", giftsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Wedding API running on port ${PORT}`);
});
