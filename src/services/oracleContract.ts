import { ethers, Contract } from "ethers";
import CheddaPriceFeed from "../artifacts/CheddaPriceFeed.json";

export class PriceOracle {
  public contract!: Contract;

  constructor(
    private provider: ethers.WebSocketProvider,
    private address: string
  ) {
    this.initializeContract();
  }

  private initializeContract() {
    if (!this.address || !this.provider) {
      throw new Error("Missing required data for contract initiation.");
    }

    this.contract = new ethers.Contract(
      this.address,
      CheddaPriceFeed.abi,
      this.provider
    );
  }

  async readPrice() {
    return await this.contract.readPrice(this.address, "0");
  }

  async decimals(): Promise<number> {
    return await this.contract.decimals();
  }

  async token(): Promise<string> {
    return await this.contract.token();
  }
}
