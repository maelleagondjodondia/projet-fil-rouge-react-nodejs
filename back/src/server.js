import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import itemRoutes from "./routes/itemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { fileURLToPath } from "url";


dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Servir les fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/items", itemRoutes);
app.use("/users", userRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/fullstack_project")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(4000, () => console.log("Server running on http://localhost:4000"));
  })
  .catch(err => console.error(err));
