import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import flightRoutes from "./routes/flightRoutes.js";
import process from "process";

dotenv.config();
import.meta.url;

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"]
}));
app.use(express.json());

app.use("/api/flights", flightRoutes);

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});