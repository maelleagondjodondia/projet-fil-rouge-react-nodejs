import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.send("API TS OK 🚀");
});

connectDB();

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
