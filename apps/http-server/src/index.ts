import express from "express";
import authRouter from "./routes/authRouter";
import roomRouter from "./routes/roomRouter";
import contentRouter from "./routes/contentRouter";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../.env") });
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      const allowed = (process.env.FRONTEND_ORIGIN || "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

      if (allowed.length === 0 || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/room", roomRouter);
app.use("/api/v1/content", contentRouter);

app.listen(parseInt(process.env.PORT || "3001"), () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
