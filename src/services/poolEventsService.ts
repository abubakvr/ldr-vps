import { Chedda } from "chedda-sdk";
import { ethers } from "ethers";
import { LeaderboardService } from "./leaderboardService";
import { PriceService } from "./priceService";
import { lendingPoolLens } from "../utils/constants";
import { tokens } from "../utils/tokens";

export class PoolEventService {
  constructor(
    private chedda: Chedda,
    private signer: ethers.JsonRpcSigner,
    private leaderboardService: LeaderboardService,
    private priceService: PriceService
  ) {}

  async listenToPoolEvents(): Promise<void> {
    const pools = await this.getPools();
    pools.forEach(async (address: string) => {
      const lendingPool = this.chedda.lendingPool(address, this.signer);
      const config = await this.getPoolConfig(lendingPool);
      this.setupEventListeners(lendingPool.contract, config);
    });
  }

  private async getPools(): Promise<string[]> {
    const lens = this.chedda.poolLens(lendingPoolLens, this.signer);
    return await lens.activePools();
  }

  private async getPoolConfig(lendingPool: any) {
    return {
      priceFeed: await lendingPool.priceFeed(),
      decimals: await lendingPool.decimals(),
      asset: await lendingPool.asset(),
    };
  }

  private setupEventListeners(contract: any, config: any): void {
    this.setupBorrowListener(contract, config);
    this.setupRepayListener(contract, config);
    this.setupCollateralListeners(contract, config);
  }

  private setupBorrowListener(contract: any, config: any): void {
    contract.on("AssetBorrowed", async (account: string, amount: any) => {
      try {
        const assetPrice = await this.priceService.getTokenPrice(
          config.asset,
          config.priceFeed
        );
        if (!assetPrice) throw new Error("Failed to get asset price");

        const formattedAmount = ethers.formatUnits(amount, config.decimals);
        const dollarAmount = Number(formattedAmount) * Number(assetPrice);

        await this.leaderboardService.updateLeaderboard(
          account,
          dollarAmount,
          "borrowAsset"
        );

        console.log({
          event: "AssetBorrowed",
          account,
          dollarAmount,
        });
      } catch (error) {
        console.error("Error processing AssetBorrowed event:", error);
      }
    });
  }

  private setupRepayListener(contract: any, config: any): void {
    contract.on(
      "AssetRepaid",
      async (
        account: string,
        repaidBy: string,
        amount: any,
        debtBurned: any
      ) => {
        try {
          const assetPrice = await this.priceService.getTokenPrice(
            config.asset,
            config.priceFeed
          );
          if (!assetPrice) throw new Error("Failed to get asset price");

          const formattedAmount = ethers.formatUnits(amount, config.decimals);
          const dollarAmount = Number(formattedAmount) * Number(assetPrice);

          await this.leaderboardService.updateLeaderboard(
            account,
            dollarAmount,
            "repayAsset"
          );

          console.log({
            event: "AssetRepaid",
            account,
            repaidBy,
            dollarAmount,
            debtBurned: ethers.formatUnits(debtBurned, config.decimals),
          });
        } catch (error) {
          console.error("Error processing AssetRepaid event:", error);
        }
      }
    );
  }

  private setupCollateralListeners(contract: any, config: any): void {
    // Collateral Added Event
    contract.on(
      "CollateralAdded",
      async (token: string, account: string, _: any, amount: any) => {
        try {
          const tokenDecimals = tokens[token].decimals;
          const tokenPrice = await this.priceService.getTokenPrice(
            token,
            config.priceFeed
          );
          if (!tokenPrice) throw new Error("Failed to get token price");

          const formattedAmount = ethers.formatUnits(amount, tokenDecimals);
          const dollarAmount = Number(formattedAmount) * Number(tokenPrice);

          await this.leaderboardService.updateLeaderboard(
            account,
            dollarAmount,
            "CollateralAdded"
          );

          console.log({
            event: "CollateralAdded",
            account,
            token,
            dollarAmount,
          });
        } catch (error) {
          console.error("Error processing CollateralAdded event:", error);
        }
      }
    );

    // Collateral Removed Event
    contract.on(
      "CollateralRemoved",
      async (token: string, account: string, _: any, amount: any) => {
        try {
          const tokenDecimals = tokens[token].decimals;
          const tokenPrice = await this.priceService.getTokenPrice(
            token,
            config.priceFeed
          );
          if (!tokenPrice) throw new Error("Failed to get token price");

          const formattedAmount = ethers.formatUnits(amount, tokenDecimals);
          const dollarAmount = Number(formattedAmount) * Number(tokenPrice);

          await this.leaderboardService.updateLeaderboard(
            account,
            dollarAmount,
            "CollateralRemoved"
          );

          console.log({
            event: "CollateralRemoved",
            account,
            token,
            dollarAmount,
          });
        } catch (error) {
          console.error("Error processing CollateralRemoved event:", error);
        }
      }
    );
  }
}
