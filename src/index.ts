import { getRevenuePathsV1, getWithdrawEventsV1, getWithdrawsForPath } from './eventsV1';
import { ethers } from "ethers"
import { getGasPaid } from './utils';
import { getWithdrawEventsV0 } from './eventsV0';

async function main() {
  // const revPathsV1 = await getWithdrawEventsV1();
  // const formattedV1 = await Promise.all(revPathsV1.map(async path => {
  //   const rawGasPaid = await getGasPaid(path.transactionHash);
  //   const gasPaid = rawGasPaid ? ethers.utils.formatEther(rawGasPaid) : ethers.BigNumber.from("0")
  //   return [
  //     path.blockNumber,
  //     path.address,
  //     path.transactionHash,
  //     Number(gasPaid),
  //     Number(ethers.utils.formatEther(path.args.payment))
  //   ]
  // }));
  // console.log(formattedV1);

  // const revPathsV0 = await getWithdrawEventsV0();
  // const formattedV0 = await Promise.all(revPathsV0.map(async (path) => {
  //   const rawGasPaid = await getGasPaid(path.transactionHash);
  //   const gasPaid = rawGasPaid ? ethers.utils.formatEther(rawGasPaid) : ethers.BigNumber.from("0")
  //   return [
  //     path.blockNumber,
  //     path.address,
  //     path.transactionHash,
  //     Number(gasPaid),
  //     Number(ethers.utils.formatEther(path.args.amount))
  //   ]
  // }));
  // console.log(formattedV0);

  // const formatted = (await getGasPaid("0xa9d1d52d50b7c1752452954100692473d0419d97238ff32f3a492e6ffef46eba")) || ethers.BigNumber.from("0");
  // console.log(ethers.utils.formatEther(formatted));
  return;
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })