import { TPresale } from "@/@types/launchpad.types";
import authorizedRequest from "./request";

export const presaleApi = {
  getPresaleList: () => {
    return authorizedRequest.get<TPresale[], TPresale[]>("/presales");
  },
  createPresale: (data: Omit<TPresale, "id">) => {
    return authorizedRequest.post<TPresale, TPresale>("/presales", data);
  },
  getPresaleByAddress: (address: string) => {
    return authorizedRequest.get<TPresale, TPresale>(`/presales/${address}`);
  },
  updatePresale: (id: number, data: Partial<TPresale>) => {
    return authorizedRequest.put<TPresale, TPresale>(`/presales/${id}`, data);
  },
};
