import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./Configuration/Connection.js";

import bookRoutes from "./Routes/Bookroutes.js";
import userRoutes from "./Routes/Userroutes.js";
import cartRoutes from "./Routes/Cartroutes.js";
import publisherRoutes from "./Routes/Publisherroutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// ✅ FIX: Resolve directory for static uploads
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// ✅ Multer uploads folder (to serve book images)
// -----------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// ✅ ROUTES
// -----------------------------
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/publishers", publisherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
