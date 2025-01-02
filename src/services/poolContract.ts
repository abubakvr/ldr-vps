import { Contract, ethers } from "ethers";
import LendingPoolArtifact from "../artifacts/LendingPool.json";

export class LendingPool {
  public contract!: Contract;

  constructor(
    private provider: ethers.WebSocketProvider,
    private poolAddress: string
  ) {
    this.initializePoolContract();
  }

  /**
   * Initializes the contract instance.
   */
  private initializePoolContract() {
    if (!this.poolAddress || !this.provider) {
      throw new Error("Missing required data for contract initiation.");
    }

    this.contract = new ethers.Contract(
      this.poolAddress,
      LendingPoolArtifact.abi,
      this.provider
    );
  }

  //Read contract ---------------------------------------------

  async asset(): Promise<string> {
    try {
      return await this.contract.asset();
    } catch (error) {
      console.error("Error in asset:", error);
      throw error;
    }
  }

  async decimals(): Promise<number> {
    try {
      return await this.contract.decimals();
    } catch (error) {
      console.error("Error in decimals:", error);
      throw error;
    }
  }

  async priceFeed(): Promise<string> {
    try {
      return await this.contract.priceFeed();
    } catch (error) {
      console.error("Error in priceFeed:", error);
      throw error;
    }
  }
}
