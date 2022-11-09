import { ethers } from "ethers";

export const communityProvider = new ethers.providers.JsonRpcProvider(
  "");

export const getGasPaid = async(txHash: string) => {
  const provider = communityProvider;
  const response = await provider.getTransaction(txHash);
  const receipt = await provider.getTransactionReceipt(txHash);
  const gasPrice = response.gasPrice;
  const gasUsed = receipt.gasUsed;
  const gasPaid = gasPrice?.mul(gasUsed);
  return gasPaid
};

