import { ethers } from "ethers";
import { LeaderboardService } from "./leaderboardService";
import { PriceService } from "./priceService";
import { lendingPoolLens, webSocketUrl } from "../utils/constants";
import { tokens } from "../utils/tokens";
import { LendingPool } from "./poolContract";
import { PoolLens } from "./lensContract";

export class PoolEventService {
  provider: ethers.WebSocketProvider;
  constructor(
    private leaderboardService: LeaderboardService,
    private priceService: PriceService
  ) {
    this.provider = new ethers.WebSocketProvider(webSocketUrl);
  }

  async listenToPoolEvents(): Promise<void> {
    const pools = await this.getPools();
    pools.forEach(async (address: string) => {
      const lendingPool = new LendingPool(this.provider, address);
      const config = await this.getPoolConfig(lendingPool);
      this.setupEventListeners(lendingPool.contract, config);
    });
  }

  private async getPools(): Promise<string[]> {
    const lens = new PoolLens(this.provider, lendingPoolLens);
    return await lens.activePools();
  }

  private async getPoolConfig(lendingPool: LendingPool) {
    try {
      const [priceFeed, decimals, asset] = await Promise.all([
        lendingPool.priceFeed(),
        lendingPool.decimals(),
        lendingPool.asset(),
      ]);

      // Validate price feed address
      if (!ethers.isAddress(priceFeed)) {
        throw new Error(`Invalid price feed address: ${priceFeed}`);
      }

      return {
        priceFeed,
        decimals,
        asset,
      };
    } catch (error) {
      console.error(`Error getting pool config for pool:`, error);
      throw error;
    }
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
