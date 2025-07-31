import { TToken } from "./token.types";

export enum EPresaleStatus {
  Upcoming = "Upcoming",
  Active = "Active",
  Completed = "Completed",
  Failed = "Failed",
  Ended = "Ended",
}

export enum EPresaleOnchainState {
  ACTIVE = 1,
  WAITING_FOR_FINALIZE = 2,
  CANCELED = 3,
  FINALIZED = 4,
}

export type TPresale = {
  id: number;
  thumbnail?: string | null; // Optional thumbnail for the presale
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  token: TToken;
  softCap: string;
  hardCap: string;
  presaleRate: string;
  liquidityRate: string;
  tokensForSale: string;
  tokensForLiquidity: string;
  liquidityPercent: number;
  // liquidityLockTime: number; // in seconds
  status: EPresaleOnchainState;
  presaleAddress: string;
  cTokenAddress: string;
  creator: string;
  txHash: string;
  raisedAmount: string;
  social: {
    website?: string | null;
    twitter?: string | null;
    telegram?: string | null;
    discord?: string | null;
    medium?: string | null;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};
