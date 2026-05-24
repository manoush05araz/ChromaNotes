import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import notesRoutes from "./routes/notesRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "http://localhost:5173", // your React dev server
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/api/notes", notesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/settings", settingsRoutes);

// connect to database
connectDB();

server.listen(5001, () => {
  console.log("Server is running on port 5001");
});