import { Request, Response } from "express";
import { Leaderboard } from "../models/leaderboardModel";

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await Leaderboard.find().skip(offset).limit(limit);

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
