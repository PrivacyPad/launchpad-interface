import { presaleApi } from "@/@api/presale.api";
import { TQueryOptions } from "@/@types/common.types";
import { EPresaleOnchainState, EPresaleStatus, TPresale } from "@/@types/launchpad.types";
import { PrivacyPresale__factory } from "@/web3/contracts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { useReadContracts } from "wagmi";

export type TPoolInfo = {
  tokenAddress: string;
  cTokenAddress: string;
  dexAddress: string;
  tokenBalance: bigint;
  tokenSoldEncrypted: string;
  tokensSold: bigint;
  weiRaise: bigint;
  ethRaisedEncrypted: string;
  tokenPerEthWithDecimals: bigint;
  cWETHAddress: string;
  state: EPresaleOnchainState;
};

export function usePresalePoolInfo(presaleAddress?: string, options?: { refetchInterval?: number | false }) {
  const { data, ...other } = useReadContracts({
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

  const normalizedData = useMemo(() => {
    if (!data) return undefined;
    const pool = data[0];
    if (!pool) return undefined;
    return {
      tokenAddress: pool[0] as Address,
      cTokenAddress: pool[1] as Address,
      dexAddress: pool[2] as Address,
      tokenBalance: BigInt(pool[3]),
      tokenSoldEncrypted: pool[4],
      tokensSold: BigInt(pool[5]),
      weiRaise: BigInt(pool[6]),
      ethRaisedEncrypted: pool[7],
      tokenPerEthWithDecimals: BigInt(pool[8]),
      cWETHAddress: pool[9] as Address,
      state: pool[10] as EPresaleOnchainState,
    } as TPoolInfo;
  }, [data]);

  return {
    data: normalizedData,
    ...other,
  };
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

export const getPresaleStatus = (presale?: TPresale, poolInfo?: TPoolInfo) => {
  if (!presale) return EPresaleStatus.Upcoming;
  const status = poolInfo?.state || presale.status;

  const now = Date.now(); // Convert to seconds
  const start = new Date(presale.startTime).getTime();
  const end = new Date(presale.endTime).getTime();
  if (now < start) return EPresaleStatus.Upcoming;
  if (now > end) {
    if (status == EPresaleOnchainState.FINALIZED) {
      return EPresaleStatus.Completed;
    } else if (status == EPresaleOnchainState.CANCELED) {
      return EPresaleStatus.Failed;
    }
    return EPresaleStatus.Ended;
  }
  return EPresaleStatus.Active;
};

export function usePresaleStatus(presale?: TPresale, poolInfo?: TPoolInfo) {
  const [status, setStatus] = useState<EPresaleStatus>(EPresaleStatus.Upcoming);

  useEffect(() => {
    setStatus(getPresaleStatus(presale, poolInfo));
    const intervalId = setInterval(() => {
      setStatus(getPresaleStatus(presale, poolInfo));
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presale, poolInfo]);

  return status;
}
