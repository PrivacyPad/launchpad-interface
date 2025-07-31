import { presaleApi } from "@/@api/presale.api";
import { EPresaleOnchainState } from "@/@types/launchpad.types";
import { TToken } from "@/@types/token.types";
import Button from "@/components/Button";
import { Button as UIButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useApproveCallback, { ApprovalState } from "@/hooks/useApproveCallback";
import { usePresaleFactoryContractWrite } from "@/hooks/useContract";
import useWeb3 from "@/hooks/useWeb3";
import { toastTxSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/error";
import { formatNumber } from "@/utils/format";
import { C_WETH9, ChainId } from "@/web3/core/constants";
import { Token } from "@/web3/core/entities";
import { getExplorerLink } from "@/web3/core/functions/explorer";
import { DialogProps } from "@radix-ui/react-dialog";
import BigNumber from "bignumber.js";
import { EventLog } from "ethers";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatUnits, parseUnits } from "viem";
import { FormData } from "./helpers";
import Link from "next/link";

export default function LaunchPresaleDialog({
  onOpenChange,
  open,
  erc20Info,
  launchpadData,
}: {
  open?: boolean;
  onOpenChange?: DialogProps["onOpenChange"];
  launchpadData: FormData;
  erc20Info: TToken;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-neutral-900 border-neutral-700 text-white max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault(); // Prevent closing on outside click
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white tracking-wider">LAUNCH PRESALE</DialogTitle>
        </DialogHeader>

        <Content launchpadData={launchpadData} erc20Info={erc20Info} onClose={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  );
}

function Content({
  launchpadData,
  erc20Info,
  onClose = () => {},
}: {
  launchpadData: FormData;
  erc20Info: TToken;
  onClose?: () => void;
}) {
  const { address, chainId } = useWeb3();
  const presaleFactoryContract = usePresaleFactoryContractWrite();

  const CWETH = C_WETH9[chainId as ChainId];

  const [launchStep, setLaunchStep] = useState(1); // 1: Token Approve, 2: Confirmation
  const [deploymentStatus, setDeploymentStatus] = useState("pending"); // pending, loading, success, error
  const [transactionHash, setTransactionHash] = useState("");
  const [presaleAddress, setPresaleAddress] = useState("");

  const data = useMemo(() => {
    const tokenAddress = launchpadData.tokenAddress;
    const softCapInWei = parseUnits(launchpadData.softCap.toString(), CWETH.decimals);
    const hardCapInWei = parseUnits(launchpadData.hardCap.toString(), CWETH.decimals);
    // const minContributionInWei = parseUnits(launchpadData.minContribution.toString(), CWETH.decimals);
    // const maxContributionInWei = parseUnits(launchpadData.maxContribution.toString(), CWETH.decimals);
    const startTime = Math.floor(launchpadData.startDate.getTime() / 1000); // Convert to seconds
    const endTime = Math.floor(launchpadData.endDate.getTime() / 1000); // Convert to seconds
    const liquidityPercent = parseUnits(launchpadData.liquidityPercent.toString(), 2); // Convert percentage to decimal

    const tokenForPresale = BigInt(
      new BigNumber(launchpadData.hardCap)
        .times(Math.pow(10, erc20Info!.decimals))
        .times(launchpadData.presaleRate)
        .toFixed(0)
    );
    const tokenAddLiquidity = BigInt(
      new BigNumber(launchpadData.hardCap)
        .times(Math.pow(10, erc20Info!.decimals))
        .times(launchpadData.liquidityPercent / 100)
        .times(launchpadData.listingRate)
        .toFixed(0)
    );

    return {
      tokenAddress,
      softCap: softCapInWei,
      hardCap: hardCapInWei,
      minContribution: BigInt(0),
      maxContribution: BigInt(0),
      startTime,
      endTime,
      tokenForPresale,
      tokenAddLiquidity,
      totalTokens: tokenForPresale + tokenAddLiquidity,
      presaleRate: launchpadData.presaleRate,
      listingRate: launchpadData.listingRate,
      liquidityPercent,
    };
  }, [erc20Info, launchpadData, CWETH]);

  const currency = useMemo(() => {
    return new Token(ChainId.SEPOLIA, erc20Info.address, erc20Info.decimals, erc20Info.symbol, erc20Info.name);
  }, [erc20Info]);

  const [approvalStatus, approve] = useApproveCallback({
    amountToApprove: data.totalTokens,
    currency,
    spender: presaleFactoryContract?.target,
    onReceipt: (tx) => {
      if (tx?.hash) {
        toastTxSuccess("Token approved successfully!", tx.hash);
      } else {
        toast.success("Token approved successfully!");
      }
    },
    onError: (error) => {
      console.error("Approval error:", error);
      toast.error("Token approval failed. Please try again.");
    },
  });

  const handleTokenApproval = async () => {
    await approve();
  };

  const handleConfirmDeployment = async () => {
    setDeploymentStatus("loading");
    try {
      if (!address) {
        toast.error("Please connect your wallet to create a launchpad.");
        return;
      }
      if (!presaleFactoryContract) {
        toast.error("Presale factory contract is not available. Please check your connection.");
        return;
      }

      const tx = await presaleFactoryContract.createPrivacyPresaleWithExistingToken(data.tokenAddress, {
        tokenAddLiquidity: data.tokenAddLiquidity,
        tokenPresale: data.tokenForPresale,
        hardCap: data.hardCap,
        softCap: data.softCap,
        start: data.startTime,
        end: data.endTime,
        liquidityPercentage: data.liquidityPercent,
      });
      const receipt = await tx.wait();
      // Read the address from TokenCreated event
      const event = receipt?.logs?.[3] as EventLog;
      const presaleAddress = event.args[1];
      const cTokenAddress = event.args[3];
      await presaleApi.createPresale({
        token: erc20Info,
        softCap: data.softCap.toString(),
        hardCap: data.hardCap.toString(),
        presaleRate: data.presaleRate.toString(),
        liquidityRate: data.listingRate.toString(),
        liquidityPercent: Number(data.liquidityPercent),
        tokensForSale: data.tokenForPresale.toString(),
        tokensForLiquidity: data.tokenAddLiquidity.toString(),
        createdAt: new Date().toISOString(),
        startTime: new Date(data.startTime * 1000).toISOString(),
        endTime: new Date(data.endTime * 1000).toISOString(),
        description: launchpadData.description,
        social: {
          website: launchpadData.website,
          twitter: launchpadData.twitter,
          telegram: launchpadData.telegram,
        },
        name: launchpadData.tokenName,
        thumbnail: launchpadData.thumbnail,
        presaleAddress: presaleAddress,
        raisedAmount: "0",
        txHash: tx.hash,
        status: EPresaleOnchainState.ACTIVE,
        updatedAt: new Date().toISOString(),
        // @ts-ignore
        liquidityLockTime: 0,
        cTokenAddress: cTokenAddress,
        creator: address,
      });
      toastTxSuccess("Launchpad created successfully!", tx.hash);
      setTransactionHash(tx.hash);
      setPresaleAddress(presaleAddress);
      setDeploymentStatus("success");
    } catch (error) {
      console.error("Error submitting launchpad data:", error);
      toast.error("Failed to create launchpad", { description: getErrorMessage(error) });
      setDeploymentStatus("error");
    }
  };

  const resetDialog = () => {
    onClose();
  };

  useEffect(() => {
    if (approvalStatus === ApprovalState.APPROVED) {
      setLaunchStep(2);
    }
  }, [approvalStatus]);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              launchStep >= 1 ? "bg-primary text-black" : "bg-neutral-700 text-neutral-400"
            )}
          >
            1
          </div>
          <span className={cn("text-sm", launchStep >= 1 ? "text-white" : "text-neutral-400")}>Token Approve</span>
        </div>

        <div className={cn("w-12 h-px", launchStep >= 2 ? "bg-primary" : "bg-neutral-700")} />

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              launchStep >= 2 ? "bg-primary text-black" : "bg-neutral-700 text-neutral-400"
            )}
          >
            2
          </div>
          <span className={cn("text-sm", launchStep >= 2 ? "text-white" : "text-neutral-400")}>Confirmation</span>
        </div>
      </div>

      {/* Step 1: Token Approval */}
      {launchStep === 1 && (
        <div className="space-y-4">
          <div className="bg-neutral-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2">Token Approval Required</h3>
            <p className="text-xs text-neutral-400 mb-3">
              You need to approve the smart contract to spend your tokens for the presale.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Token:</span>
                <span className="text-white font-mono">{launchpadData.tokenSymbol || "TOKEN"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Amount:</span>
                <span className="text-white font-mono">
                  {formatNumber(formatUnits(data.totalTokens, erc20Info.decimals))} {erc20Info.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Gas Fee:</span>
                <span className="text-white font-mono">~0.0001 ETH</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleTokenApproval}
            disabled={
              approvalStatus === ApprovalState.PENDING ||
              approvalStatus === ApprovalState.UNKNOWN ||
              approvalStatus === ApprovalState.APPROVED
            }
            className="w-full bg-primary hover:bg-primary/80 text-black font-semibold"
            loading={approvalStatus === ApprovalState.PENDING}
            loadingText="Approving..."
          >
            {approvalStatus === ApprovalState.APPROVED ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approved
              </>
            ) : (
              "Approve Tokens"
            )}
          </Button>
        </div>
      )}

      {/* Step 2: Confirmation */}
      {launchStep === 2 && (
        <div className="space-y-4">
          <div className="bg-neutral-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2">Confirm Presale Launch</h3>
            <p className="text-xs text-neutral-400 mb-3">Review your presale details and confirm the deployment.</p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Token:</span>
                <span className="text-white font-mono">{launchpadData.tokenName || "Token Name"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Soft Cap:</span>
                <span className="text-white font-mono">
                  {formatNumber(launchpadData.softCap, { fractionDigits: 6 }) || "0"} {CWETH.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Hard Cap:</span>
                <span className="text-white font-mono">
                  {formatNumber(launchpadData.hardCap, { fractionDigits: 6 }) || "0"} {CWETH.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Presale Rate:</span>
                <span className="text-white font-mono">
                  {formatNumber(launchpadData.presaleRate, { fractionDigits: 6 }) || "0"} {erc20Info.symbol}/
                  {CWETH.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Listing Rate:</span>
                <span className="text-white font-mono">
                  {formatNumber(launchpadData.listingRate, { fractionDigits: 6 }) || "0"} {erc20Info.symbol}/
                  {CWETH.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Platform Fee:</span>
                <span className="text-white font-mono">0%</span>
              </div>
            </div>
          </div>

          {deploymentStatus === "success" && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Presale Launched Successfully!</span>
              </div>
              <div className="text-xs text-neutral-400 break-all">
                Transaction:
                <a
                  href={getExplorerLink(chainId, transactionHash, "transaction")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-green-400 font-mono text-xs underline hover:text-green-300"
                >
                  {transactionHash}
                </a>
              </div>
            </div>
          )}

          {deploymentStatus === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">Deployment failed. Please try again.</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetDialog}
              className="flex-1 border-neutral-700 text-neutral-400 hover:bg-neutral-800 bg-transparent"
            >
              Cancel
            </Button>
            {deploymentStatus === "success" && presaleAddress ? (
              <UIButton asChild className="flex-1 bg-primary hover:bg-primary/80 text-black font-semibold">
                <Link href={`/launchpad/${presaleAddress}`}>View Presale</Link>
              </UIButton>
            ) : (
              <Button
                onClick={handleConfirmDeployment}
                disabled={deploymentStatus === "loading" || deploymentStatus === "success"}
                className="flex-1 bg-primary hover:bg-primary/80 text-black font-semibold"
                loading={deploymentStatus === "loading"}
                loadingText="Deploying..."
              >
                {deploymentStatus === "success" ? "Completed" : "Confirm Launch"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
