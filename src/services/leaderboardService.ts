import { Leaderboard } from "../models/leaderboardModel";
import { LeaderboardEntry, TransactionType } from "../utils/types";

export class LeaderboardService {
  private static POINTS_PER_DOLLAR_SUPPLY = 10;
  private static POINTS_PER_DOLLAR_BORROW = 15;
  private static HOURS_IN_DAY = 0.2;

  async generateUniqueReferralCode(): Promise<string> {
    let isUnique = false;
    let referralCode: string;

    while (!isUnique) {
      referralCode = Math.floor(10000000 + Math.random() * 900000).toString();
      const existing = await Leaderboard.findOne({ referralCode });
      if (!existing) isUnique = true;
    }
    return referralCode;
  }

  async updateLeaderboard(
    address: string,
    amount: number,
    type: TransactionType
  ): Promise<LeaderboardEntry> {
    try {
      let leaderboard = await Leaderboard.findOne({ address });

      if (leaderboard) {
        this.updateExistingEntry(leaderboard, amount, type);
      } else {
        leaderboard = await this.createNewEntry(address, amount, type);
      }

      await leaderboard.save();
      return leaderboard;
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      throw error;
    }
  }

  async calculateHourlyPoints(): Promise<void> {
    try {
      const accounts = await Leaderboard.find({});
      for (const account of accounts) {
        const supplyPoints =
          (account.supply * LeaderboardService.POINTS_PER_DOLLAR_SUPPLY) /
          LeaderboardService.HOURS_IN_DAY;
        const borrowPoints =
          (account.borrow * LeaderboardService.POINTS_PER_DOLLAR_BORROW) /
          LeaderboardService.HOURS_IN_DAY;

        account.total = (account.total || 0) + supplyPoints + borrowPoints;
        await account.save();
      }
    } catch (error) {
      console.error("Error calculating points:", error);
      throw error;
    }
  }

  private async createNewEntry(
    address: string,
    amount: number,
    type: TransactionType
  ) {
    return await Leaderboard.create({
      address,
      referralCode: await this.generateUniqueReferralCode(),
      supply: this.isSupplyType(type) ? amount : 0,
      borrow: this.isBorrowType(type) ? amount : 0,
      earlybird: 0,
      referral: 0,
      total: 0,
    });
  }

  private updateExistingEntry(
    entry: LeaderboardEntry,
    amount: number,
    type: TransactionType
  ): void {
    if (type === "borrowAsset") {
      entry.borrow += amount;
    } else if (type === "CollateralAdded") {
      entry.supply += amount;
    } else if (type === "repayAsset" || type === "CollateralRemoved") {
      entry.supply -= amount;
    }
  }

  private isSupplyType(type: TransactionType): boolean {
    return type === "CollateralAdded" || type === "CollateralRemoved";
  }

  private isBorrowType(type: TransactionType): boolean {
    return type === "borrowAsset" || type === "repayAsset";
  }
}
