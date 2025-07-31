import { presaleApi } from "@/@api/presale.api";
import { TQueryOptions } from "@/@types/common.types";
import { EPresaleOnchainState, EPresaleStatus, TPresale } from "@/@types/launchpad.types";
import { PrivacyPresale__factory } from "@/web3/contracts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
      ...options,
      refetchInterval: 5000, // Refetch every 5 seconds
      gcTime: 0, // Disable garbage collection to keep the data fresh
    },
  });
}

export function usePresaleListQuery(options?: TQueryOptions<TPresale[]>) {
  return useQuery({
    queryKey: ["presaleList"],
    queryFn: async () => {
      return presaleApi.getPresaleList();
    },
    staleTime: 10_000,
    ...options,
    enabled: options?.enabled ?? false,
  });
}

export function usePresaleQuery(presaleAddress?: string, options?: TQueryOptions<TPresale>) {
  return useQuery({
    queryKey: ["presale", presaleAddress],
    queryFn: async () => {
      return presaleApi.getPresaleByAddress(presaleAddress as string);
    },
    staleTime: 10_000,
    ...options,
    enabled: !!presaleAddress && (options?.enabled ?? false),
  });
}

export const getPresaleStatus = (presale?: TPresale) => {
  if (!presale) return EPresaleStatus.Upcoming;

  const now = Date.now(); // Convert to seconds
  const start = new Date(presale.startTime).getTime();
  const end = new Date(presale.endTime).getTime();
  if (now < start) return EPresaleStatus.Upcoming;
  if (now > end) {
    if (presale.status == EPresaleOnchainState.FINALIZED) {
      return EPresaleStatus.Completed;
    } else if (presale.status == EPresaleOnchainState.CANCELED) {
      return EPresaleStatus.Failed;
    }
  }
  return EPresaleStatus.Active;
};

export function usePresaleStatus(presale?: TPresale) {
  const [status, setStatus] = useState<EPresaleStatus>(EPresaleStatus.Upcoming);

  useEffect(() => {
    setStatus(getPresaleStatus(presale));
    const intervalId = setInterval(() => {
      setStatus(getPresaleStatus(presale));
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presale]);

  return status;
}
