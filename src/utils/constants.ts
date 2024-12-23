import dotenv from "dotenv";
dotenv.config();

const alchemyKey = process.env.ALCHEMY_API_KEY;

export const lendingPoolLens = "0xB99Caa9905cf847AD19e5435FaB5743F37dDf0d7";
export const jsonRpcUrl = `https://base-sepolia.g.alchemy.com/v2/${alchemyKey}`;
export const walletAddress = "0xF7f21E2f2Da95B1481cb1254ea9BCBc0A124C175";
