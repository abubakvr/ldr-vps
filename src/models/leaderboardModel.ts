import mongoose, { Schema, Document } from "mongoose";

interface ILeaderboard extends Document {
  address: string;
  referralCode: string;
  positions: Array<{
    asset: string;
    priceFeed: string;
    supplied: number;
    borrowed: number;
  }>;
  supply: number;
  borrow: number;
  earlybird: number;
  referral: number;
  supplyPoints: number;
  borrowPoints: number;
  total: number;
}

const leaderboardSchema = new Schema({
  address: { type: String, required: true, unique: true, index: true },
  referralCode: { type: String, required: true },
  positions: [
    {
      asset: { type: String, required: true },
      priceFeed: { type: String, required: true },
      supplied: { type: Number, required: true },
      borrowed: { type: Number, required: true },
    },
  ],
  supply: { type: Number, required: true },
  borrow: { type: Number, required: true },
  supplyPoints: { type: Number, required: true },
  borrowPoints: { type: Number, required: true },
  earlybird: { type: Number, required: true },
  referral: { type: Number, required: true },
  total: { type: Number, required: true },
});

export const Leaderboard = mongoose.model<ILeaderboard>(
  "Leaderboard",
  leaderboardSchema
);
