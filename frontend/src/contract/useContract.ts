import { Contract } from "ethers";
import { useCallback } from "react";
import { CONTRACT_ADDRESS } from "../config";
import { useWallet } from "../wallet/WalletProvider";
import { DIPLOMA_ABI } from "./abi";

export function useReadContract() {
  const { getReadProvider } = useWallet();
  return useCallback(
    () => new Contract(CONTRACT_ADDRESS, DIPLOMA_ABI, getReadProvider()),
    [getReadProvider]
  );
}

export function useWriteContract() {
  const { getSigner } = useWallet();
  return useCallback(async () => {
    const signer = await getSigner();
    return new Contract(CONTRACT_ADDRESS, DIPLOMA_ABI, signer);
  }, [getSigner]);
}
