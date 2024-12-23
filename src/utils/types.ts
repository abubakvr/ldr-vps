export interface LeaderboardEntry {
  address: string;
  referralCode: string;
  supply: number;
  borrow: number;
  earlybird: number;
  referral: number;
  total: number;
}

export type TransactionType =
  | "borrowAsset"
  | "repayAsset"
  | "CollateralAdded"
  | "CollateralRemoved";
