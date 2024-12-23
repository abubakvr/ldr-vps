import { Chedda } from "chedda-sdk";
import { ethers } from "ethers";

export class PriceService {
  constructor(private chedda: Chedda) {}

  async getTokenPrice(
    asset: string,
    priceFeed: string
  ): Promise<string | null> {
    try {
      const priceOracle = this.chedda.priceOracle(priceFeed);
      const assetPrice = await priceOracle.readPrice(asset);
      const decimals = await priceOracle.decimals();
      return ethers.formatUnits(assetPrice, decimals);
    } catch (error) {
      console.error("Error getting token price:", error);
      return null;
    }
  }
}
