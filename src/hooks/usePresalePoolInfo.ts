import { PrivacyPresale__factory } from "@/web3/contracts";
import { Address } from "viem";
import { useReadContracts } from "wagmi";

export function usePresalePoolInfo(presaleAddress?: string, options?: { refetchInterval?: number }) {
  return useReadContracts({
    contracts: [
      {
        address: presaleAddress as Address,
        abi: PrivacyPresale__factory.abi,
        functionName: "pool",
      },
    ],
    allowFailure: false,
    query: {
      // @ts-ignore
      refetchInterval: 10000, // Refetch every 10 seconds
      ...options,
    },
  });
}
