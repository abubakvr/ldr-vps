import { ethers } from "ethers";
import { Chedda } from "chedda-sdk";
import { tokens } from "../utils/tokens";
import { Leaderboard } from "../models/leaderboardModel";
import { jsonRpcUrl, lendingPoolLens } from "../utils/constants";

const chedda = new Chedda(jsonRpcUrl);
const provider = new ethers.JsonRpcProvider(jsonRpcUrl);
const signer = new ethers.JsonRpcSigner(
  provider,
  "0xF7f21E2f2Da95B1481cb1254ea9BCBc0A124C175"
);
const lens = chedda.poolLens(lendingPoolLens, signer);

const getPools = async () => {
  return await lens.activePools();
};

const generateUniqueReferralCode = async () => {
  let isUnique = false;
  let referralCode;

  while (!isUnique) {
    // Generate a random 6-digit number
    referralCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if this code already exists in the database
    const existing = await Leaderboard.findOne({ referralCode });

    if (!existing) {
      isUnique = true;
    }
  }

  return referralCode;
};

const updateLeaderboard = async (
  address: string,
  amount: string,
  type: string
) => {
  try {
    let leaderboard = await Leaderboard.findOne({ address });

    if (leaderboard) {
      if (type === "borrowAsset") {
        leaderboard.borrow += parseFloat(amount);
      } else if (type === "CollateralAdded") {
        leaderboard.supply += parseFloat(amount);
      } else if (type === "repayAsset") {
        leaderboard.supply -= parseFloat(amount);
      } else if (type === "CollateralRemoved") {
        leaderboard.supply -= parseFloat(amount);
      }
      // Recalculate total
      leaderboard.total =
        leaderboard.supply +
        leaderboard.borrow +
        leaderboard.earlybird +
        leaderboard.referral;
      await leaderboard.save();
    } else {
      // Create new record
      leaderboard = new Leaderboard({
        address,
        referralCode: await generateUniqueReferralCode(),
        supply:
          type === "CollateralAdded" || type === "CollateralRemoved"
            ? parseFloat(amount)
            : 0,
        borrow:
          type === "borrowAsset" || type === "repayAsset"
            ? parseFloat(amount)
            : 0,
        earlybird: 0,
        referral: 0,
        total: parseFloat(amount), // Initial total is just the supply or borrow amount
      });
      await leaderboard.save();
    }
    return leaderboard;
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    throw error;
  }
};

export const listenToPoolEvents = async () => {
  const pools = await getPools();
  pools.map(async (address: string) => {
    const lendingPool = chedda.lendingPool(address, signer);
    const poolDecimals = await lendingPool.decimals();
    const contract = lendingPool.contract;
    contract.on("AssetBorrowed", (address: string, amount: any) => {
      const formattedAmount = ethers.formatUnits(amount, poolDecimals);
      updateLeaderboard(address, formattedAmount, "borrowAsset");
      //Console.log
      console.log("address", address);
      console.log("amount", formattedAmount);
    });
    contract.on("AssetRepaid", (address: string, amount: any) => {
      const formattedAmount = ethers.formatUnits(amount, poolDecimals);
      updateLeaderboard(address, formattedAmount, "repayAsset");
      //Console.log
      console.log("address", address);
      console.log("amount", formattedAmount);
    });
    contract.on(
      "CollateralAdded",
      (token: string, account: string, _: any, amount: any) => {
        const tokenDecimals = tokens[token].decimals;
        const formattedAmount = ethers.formatUnits(amount, tokenDecimals);
        updateLeaderboard(account, formattedAmount, "CollateralAdded");
        //Console.log
        console.log("account", account);
        console.log("token", token);
        console.log("amount", formattedAmount);
      }
    );
    contract.on(
      "CollateralRemoved",
      (token: string, account: string, _: any, amount: any) => {
        const tokenDecimals = tokens[token].decimals;
        const formattedAmount = ethers.formatUnits(amount, tokenDecimals);
        updateLeaderboard(account, formattedAmount, "CollateralRemoved");
        //Console.log
        console.log("account", account);
        console.log("token", token);
        console.log("amount", formattedAmount);
      }
    );
  });
};
