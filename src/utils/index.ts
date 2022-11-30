import { ethers } from "ethers";
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export const communityProvider = () => {
  if (!process.env.RPC_URL) {
    throw new Error("you need an `RPC_URL` in your `.env`");
  }
  return new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
}

export const communitySigner = () => {
  if (!process.env.SIGNER_KEY) {
    throw new Error("you need an `SIGNER_KEY` in your `.env`");
  }

  if (process.env.NODE_ENV !== "production") return new ethers.Wallet(process.env.SIGNER_KEY, communityProvider())

  return
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

