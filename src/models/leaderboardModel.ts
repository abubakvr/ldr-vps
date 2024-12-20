import mongoose, { Schema, Document } from "mongoose";

interface ILeaderboard extends Document {
  address: string;
  referralCode: string;
  supply: number;
  borrow: number;
  earlybird: number;
  referral: number;
  total: number;
}

const leaderboardSchema = new Schema({
  address: { type: String, required: true, unique: true, index: true },
  referralCode: { type: String, required: true },
  supply: { type: Number, required: true },
  borrow: { type: Number, required: true },
  earlybird: { type: Number, required: true },
  referral: { type: Number, required: true },
  total: { type: Number, required: true },
});

export const Leaderboard = mongoose.model<ILeaderboard>(
  "Leaderboard",
  leaderboardSchema
);
