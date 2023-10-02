import { ethers } from "ethers";
import { getGasPaid } from "./utils";

export const v1GasPaid = async () => {
  // const revPaths = await getWithdrawEventsV1();
  // const formatted = await Promise.all(revPaths.map(async path => {
  //   const rawGasPaid = await getGasPaid(path.transactionHash);
  //   const gasPaid = rawGasPaid ? ethers.formatEther(rawGasPaid) : ethers.BigNumberish.from("0")
  //   return [
  //     path.blockNumber,
  //     path.address,
  //     path.transactionHash,
  //     Number(gasPaid),
  //     Number(ethers.formatEther(path.args.payment))
  //   ]
  // }));
  // console.log(formatted);
  // return formatted;
}

export const v0GasPaid = async () => {
  // const revPathsV0 = await getWithdrawEventsV0();
  // const formattedV0 = await Promise.all(revPathsV0.map(async (path) => {
  //   const rawGasPaid = await getGasPaid(path.transactionHash);
  //   const gasPaid = rawGasPaid ? ethers.formatEther(rawGasPaid) : ethers.BigNumberish.from("0")
  //   return [
  //     path.blockNumber,
  //     path.address,
  //     path.transactionHash,
  //     Number(gasPaid),
  //     Number(ethers.formatEther(path.args.amount))
  //   ]
  // }));
  // console.log(formattedV0);
  // return formattedV0;
}