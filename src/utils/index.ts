import { ethers } from "ethers";
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export const communityProvider = () => {
  if (!process.env.RPC_URL) {
    throw new Error("you need an `RPC_URL` in your `.env`");
  }
  return new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
}

export const getGasPaid = async(txHash: string) => {
  const provider = communityProvider();
  const response = await provider.getTransaction(txHash);
  const receipt = await provider.getTransactionReceipt(txHash);
  const gasPrice = response.gasPrice;
  const gasUsed = receipt.gasUsed;
  const gasPaid = gasPrice?.mul(gasUsed);
  return gasPaid
};

