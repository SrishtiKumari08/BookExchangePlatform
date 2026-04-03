import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import path from "path";
import exchangeRoutes from "./routes/exchangeRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/exchange",exchangeRoutes);
app.get("/", (req, res) => {
    res.send("Book Exchange API Running");
});


export default app;