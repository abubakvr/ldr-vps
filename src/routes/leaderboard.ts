import express from "express";
import * as leaderboardController from "../controllers/leaderboardController";
const router = express.Router();

// Define routes
router.get("/", leaderboardController.getLeaderboard);

export default router;
