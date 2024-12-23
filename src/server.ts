import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import leaderboardRoute from "./routes/leaderboard";
import { initLeaderboardServices } from "./services";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5001;
const app = express();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Limit each IP to 100 requests per windowMs
  message: {
    status: "error",
    code: 429,
    message: "Too many requests, please try again later",
  },
});

// Apply rate limiting to all routes
app.use(limiter);
app.use(cors());
app.use(express.json());

// Add this middleware before your routes
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "POST") {
    res.status(405).json({
      status: "error",
      code: 405,
      message: "POST requests are not allowed",
    });
  } else {
    next();
  }
});
// Set up event listeners
initLeaderboardServices();
// Routes
app.use("/api/leaderboard", leaderboardRoute);

app.use("/", (_, res) => {
  res.status(200).json({ status: "ok", code: 200 });
});

// Connect to DB and start server
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
