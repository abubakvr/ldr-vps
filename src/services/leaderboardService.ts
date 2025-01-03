import { Leaderboard } from "../models/leaderboardModel";
import { LeaderboardEntry, TransactionType } from "../utils/types";
import { PriceService } from "./priceService";

export class LeaderboardService {
  private static POINTS_PER_DOLLAR_SUPPLY = 10;
  private static POINTS_PER_DOLLAR_BORROW = 15;
  private static HOURS_IN_DAY = 0.2;

  constructor(private priceService: PriceService) {}

  async generateUniqueReferralCode(): Promise<string> {
    let isUnique = false;
    let referralCode: string;

    while (!isUnique) {
      referralCode = Math.floor(10000000 + Math.random() * 90000000).toString();
      const existing = await Leaderboard.findOne({ referralCode });
      if (!existing) isUnique = true;
    }
    return referralCode;
  }

  async updateLeaderboard(
    address: string,
    amount: number,
    type: TransactionType,
    asset: string,
    priceFeed: string
  ): Promise<LeaderboardEntry> {
    try {
      let leaderboard = await Leaderboard.findOne({ address });

      if (leaderboard) {
        this.updateExistingEntry(leaderboard, amount, type, asset, priceFeed);
      } else {
        leaderboard = await this.createNewEntry(
          address,
          amount,
          type,
          asset,
          priceFeed
        );
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
        // Calculate totals from positions
        let totalSupply = 0;
        let totalBorrow = 0;

        // Process each position sequentially
        for (const position of account.positions) {
          const tokenPrice = await this.priceService.getTokenPrice(
            position.asset,
            position.priceFeed
          );

          // Add USD values to totals
          totalSupply += position.supplied * Number(tokenPrice);
          totalBorrow += position.borrowed * Number(tokenPrice);
        }

        // Update account supply and borrow
        account.supply = totalSupply;
        account.borrow = totalBorrow;

        // Calculate points
        const supplyPoints =
          (totalSupply * LeaderboardService.POINTS_PER_DOLLAR_SUPPLY) /
          LeaderboardService.HOURS_IN_DAY;
        const borrowPoints =
          (totalBorrow * LeaderboardService.POINTS_PER_DOLLAR_BORROW) /
          LeaderboardService.HOURS_IN_DAY;

        // Update points
        account.supplyPoints = (account.supplyPoints || 0) + supplyPoints;
        account.borrowPoints = (account.borrowPoints || 0) + borrowPoints;
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
    type: TransactionType,
    asset: string,
    priceFeed: string
  ) {
    return await Leaderboard.create({
      address,
      referralCode: await this.generateUniqueReferralCode(),
      supply: this.isSupplyType(type) ? amount : 0,
      borrow: this.isBorrowType(type) ? amount : 0,
      earlybird: 0,
      referral: 0,
      total: 0,
      positions: [
        {
          asset,
          priceFeed,
          supplied: this.isSupplyType(type) ? amount : 0,
          borrowed: this.isBorrowType(type) ? amount : 0,
        },
      ],
      supplyPoints: 0,
      borrowPoints: 0,
    });
  }

  private updateExistingEntry(
    entry: LeaderboardEntry,
    amount: number,
    type: TransactionType,
    asset: string,
    priceFeed: string
  ): void {
    // Update total supply/borrow as before
    if (type === "borrowAsset") {
      entry.borrow += amount;
    } else if (type === "CollateralAdded") {
      entry.supply += amount;
    } else if (type === "repayAsset" || type === "CollateralRemoved") {
      entry.supply -= amount;
    }

    // Find existing position for this asset
    const position = entry.positions.find((p) => p.asset === asset);

    if (position) {
      // Update existing position
      if (this.isSupplyType(type)) {
        position.supplied =
          position.supplied + (type === "CollateralAdded" ? amount : -amount);
      } else if (this.isBorrowType(type)) {
        position.borrowed =
          position.borrowed + (type === "borrowAsset" ? amount : -amount);
      }
    } else {
      // Create new position
      entry.positions.push({
        asset,
        priceFeed,
        supplied: this.isSupplyType(type) ? amount : 0,
        borrowed: this.isBorrowType(type) ? amount : 0,
      });
    }
  }

  private isSupplyType(type: TransactionType): boolean {
    return type === "CollateralAdded" || type === "CollateralRemoved";
  }

  private isBorrowType(type: TransactionType): boolean {
    return type === "borrowAsset" || type === "repayAsset";
  }
}
