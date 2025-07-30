import { TToken } from "@/@types/token.types";
import authorizedRequest from "./request";

export const tokenApi = {
  getTokenList: () => {
    return authorizedRequest.get<TToken[]>("/tokens");
  },
  getTokenByAddress: (address: string) => {
    return authorizedRequest.get<TToken>(`/tokens/${address}`);
  },
  createToken: (data: TToken) => {
    return authorizedRequest.post<TToken>("/tokens", data);
  },
};
