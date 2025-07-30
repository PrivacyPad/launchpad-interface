import { AddressMap } from "../types";
import { ChainId } from "./chains";

export const WETH9_ADDRESS: AddressMap = {
  [ChainId.SEPOLIA]: "",
};

export const TOKEN_FACTORY_ADDRESS: AddressMap = {
  [ChainId.SEPOLIA]: "0xcE2084DcaA1561305156755e4fc1ea443972A6aD",
};

export const CONFIDENTIAL_WETH_ADDRESS: AddressMap = {
  [ChainId.SEPOLIA]: "0x1A7258dFA114fc3Daf2849F131aF022E3Ec90eEe",
};

export const PRIVACY_PRESALE_FACTORY_ADDRESS: AddressMap = {
  [ChainId.SEPOLIA]: "0xe0dcee4066D0a7389764e1d582f1Edc06aD6F02e",
};
