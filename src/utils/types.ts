export interface LeaderboardEntry {
  address: string;
  positions: Array<{
    asset: string;
    priceFeed: string;
    supplied: number;
    borrowed: number;
  }>;
  referralCode: string;
  supply: number;
  borrow: number;
  earlybird: number;
  referral: number;
  supplyPoints: number;
  borrowPoints: number;
  total: number;
}

export type TransactionType =
  | "borrowAsset"
  | "repayAsset"
  | "CollateralAdded"
  | "CollateralRemoved";
