import { useCallback, useMemo, useState } from "react";

import { MaxUint256 } from "@/web3/core/constants";
import { Currency, Token } from "@/web3/core/entities";
import { calculateGasMargin } from "@/web3/core/functions/trade";

import { OPERATOR_EXPIRY_OFFSET } from "@/configs/zama.config";
import { ConfidentialFungibleToken__factory } from "@/web3/contracts";
import { Addressable, ContractTransactionReceipt } from "ethers";
import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";
import { useConfidentialFungibleTokenContractWrite, useErc20ContractWrite } from "./useContract";
import useWeb3 from "./useWeb3";

export enum ApprovalState {
  UNKNOWN = "UNKNOWN",
  NOT_APPROVED = "NOT_APPROVED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

export function useTokenAllowance(token?: Token, owner?: string, spender?: string | Addressable) {
  const args = useMemo(() => [owner, spender], [owner, spender]);

  return useReadContract({
    abi: erc20Abi,
    address: token?.address as any,
    functionName: "allowance",
    args: args as any,
    query: {
      enabled: Boolean(owner && token),
    },
  });
}

export function useConfidentialTokenApproval(token?: Token, owner?: string, spender?: string | Addressable) {
  const args = useMemo(() => [owner, spender], [owner, spender]);

  return useReadContract({
    abi: ConfidentialFungibleToken__factory.abi,
    address: token?.address as any,
    functionName: "isOperator",
    args: args as any,
    query: {
      enabled: Boolean(owner && token),
    },
  });
}

interface IUseApproveCallbackProps {
  amountToApprove?: bigint;
  currency?: Currency;
  spender?: string | Addressable;
  onReceipt?: (tx: ContractTransactionReceipt | null) => void;
  onError?: (error: Error) => void;
}

export default function useApproveCallback({
  amountToApprove,
  currency,
  spender,
  onReceipt = () => {},
  onError = () => {},
}: IUseApproveCallbackProps): [ApprovalState, () => Promise<void>] {
  const { address } = useWeb3();
  const token = currency?.isToken ? currency : undefined;
  const { data: currentAllowance, refetch: allowanceRefetch } = useTokenAllowance(token, address ?? undefined, spender);
  const [approving, setApproving] = useState<boolean>(false);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender || !currency) return ApprovalState.UNKNOWN;
    if (currency.isNative) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (currentAllowance == undefined) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance < amountToApprove
      ? approving
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, spender, currency, currentAllowance, approving]);

  const tokenContract = useErc20ContractWrite(token?.address);

  const approve = useCallback(async () => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return;
    }
    if (!token) {
      console.error("no token");
      return;
    }

    if (!tokenContract) {
      console.error("tokenContract is null");
      return;
    }

    if (!amountToApprove) {
      console.error("missing amount to approve");
      return;
    }

    if (!spender) {
      console.error("no spender");
      return;
    }

    setApproving(true);

    try {
      let useExact = false;
      const estimatedGas = await tokenContract.approve.estimateGas(spender, MaxUint256).catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true;
        return tokenContract.approve.estimateGas(spender, amountToApprove);
      });

      const res = await tokenContract
        .approve(spender, useExact ? amountToApprove : MaxUint256, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .catch((error: Error) => {
          console.debug("Failed to approve token", error);
          setApproving(false);
          throw error;
        });

      const tx = await res.wait();
      onReceipt(tx);
      allowanceRefetch();
    } catch (error) {
      onError(error as Error);
    }

    setApproving(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalState, token, tokenContract, amountToApprove, spender]);

  return [approvalState, approve];
}

export function useConfidentialApproveCallback({
  currency,
  spender,
  onReceipt = () => {},
  onError = () => {},
}: Pick<IUseApproveCallbackProps, "currency" | "spender" | "onReceipt" | "onError">): [
  ApprovalState,
  () => Promise<void>,
] {
  const { address } = useWeb3();

  const token = currency?.isToken ? currency : undefined;
  const { data: isOperator, refetch: isOperatorRefetch } = useConfidentialTokenApproval(
    token,
    address ?? undefined,
    spender as string | Addressable
  );

  const [approving, setApproving] = useState<boolean>(false);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!spender || !currency) return ApprovalState.UNKNOWN;
    if (currency.isNative || isOperator) return ApprovalState.APPROVED;

    // amountToApprove will be defined if currentAllowance is
    return approving ? ApprovalState.PENDING : ApprovalState.NOT_APPROVED;
  }, [spender, currency, isOperator, approving]);

  const tokenContract = useConfidentialFungibleTokenContractWrite(token?.address);

  const approve = useCallback(async () => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return;
    }
    if (!token) {
      console.error("no token");
      return;
    }

    if (!tokenContract) {
      console.error("tokenContract is null");
      return;
    }

    if (!spender) {
      console.error("no spender");
      return;
    }

    setApproving(true);

    try {
      const until = Math.floor(Date.now() / 1000) + OPERATOR_EXPIRY_OFFSET;
      const estimatedGas = await tokenContract.setOperator.estimateGas(spender, until);

      const res = await tokenContract
        .setOperator(spender, until, {
          gasLimit: calculateGasMargin(estimatedGas),
        })
        .catch((error: Error) => {
          console.debug("Failed to approve token", error);
          setApproving(false);
          throw error;
        });

      const tx = await res.wait();
      onReceipt(tx);
      isOperatorRefetch();
    } catch (error) {
      onError(error as Error);
    }

    setApproving(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalState, token, tokenContract, spender]);

  return [approvalState, approve];
}
