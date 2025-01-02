import { Contract, ethers } from "ethers";
import LendingPoolLensArtifact from "../artifacts/LendingPoolLens.json";

export class PoolLens {
  public contract!: Contract;

  constructor(
    private provider: ethers.WebSocketProvider,
    private lensAddress: string
  ) {
    this.initializeLensContract();
  }

  /**
   * Initializes the contract instance.
   */
  private initializeLensContract() {
    if (!this.lensAddress || !this.provider) {
      throw new Error("Missing required data for contract initiation.");
    }

    this.contract = new ethers.Contract(
      this.lensAddress,
      LendingPoolLensArtifact.abi,
      this.provider
    );
  }

  //Read contract ---------------------------------------------

  async activePools(): Promise<string[]> {
    try {
      return await this.contract.activePools();
    } catch (error) {
      this.handleContractError(error, "getting active pools");
      throw error;
    }
  }

  private handleContractError(error: any, message: string) {
    console.error(`Error in ${message}:`, error);
  }
}
