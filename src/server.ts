import express from "express";
import { connectDB } from "./config/db";
import leaderboardRoute from "./routes/leaderboard";
import { listenToPoolEvents } from "./services/depositService";

const PORT = process.env.PORT || 5001;
const app = express();

// Middleware
app.use(express.json());

// Set up event listeners
listenToPoolEvents();
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
