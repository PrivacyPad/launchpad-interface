import { TPresale } from "@/@types/launchpad.types";
import authorizedRequest from "./request";

export const presaleApi = {
  getPresaleList: () => {
    return authorizedRequest.get<TPresale[]>("/presales");
  },
  createPresale: (data: TPresale) => {
    return authorizedRequest.post<TPresale>("/presales", data);
  },
  getPresaleByAddress: (address: string) => {
    return authorizedRequest.get<TPresale>(`/presales/${address}`);
  },
  updatePresale: (id: number, data: Partial<TPresale>) => {
    return authorizedRequest.put<TPresale>(`/presales/${id}`, data);
  },
};
