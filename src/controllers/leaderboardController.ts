import { Request, Response } from "express";
import { Leaderboard } from "../models/leaderboardModel.js";

export const getLeaderboard = async (_: Request, res: Response) => {
  try {
    const users: any[] = await Leaderboard.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
