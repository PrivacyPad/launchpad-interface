export enum EPresaleStatus {
  Upcoming = "Upcoming",
  Active = "Active",
  Ended = "Ended",
}

export enum EPresaleOnchainState {
  ACTIVE = 1,
  WAITING_FOR_FINALIZE = 2,
  CANCELED = 3,
  FINALIZED = 4,
}

export type TToken = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  totalSupply: string;
  icon?: string; // Optional icon for the token
};

export type TPresale = {
  id: number;
  thumbnail?: string; // Optional thumbnail for the presale
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  token: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    totalSupply: string;
    icon?: string;
  };
  softCap: string;
  hardCap: string;
  presaleRate: string;
  liquidityRate: string;
  tokensForSale: string;
  tokensForLiquidity: string;
  liquidityPercent: number;
  status: EPresaleStatus;
  liquidityLockTime: number;
  presaleAddress: string;
  raisedAmount: string;
  social: {
    website?: string | null;
    twitter?: string | null;
    telegram?: string | null;
    discord?: string | null;
    medium?: string | null;
  };
};
