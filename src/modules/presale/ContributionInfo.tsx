import { TPresale } from "@/@types/launchpad.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import useZamaRelayerInstance from "@/hooks/useZamaRelayerInstance";
import { formatNumber } from "@/utils/format";
import { PrivacyPresale__factory } from "@/web3/contracts";
import { Token } from "@/web3/core/entities";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Address, formatUnits } from "viem";
import { usePublicClient } from "wagmi";

interface ContributionInfoProps {
  launchpadData: TPresale;
  CWETH: Token;
  address: string;
}

export default function ContributionInfo({ launchpadData, CWETH, address }: ContributionInfoProps) {
  const publicClient = usePublicClient();
  const signer = useEthersSigner();
  const relayerInstance = useZamaRelayerInstance();

  const [isRevealed, setIsRevealed] = useState(false);

  const {
    data,
    isPending: isInfoLoading,
    mutateAsync: fetchInfo,
  } = useMutation({
    mutationFn: async () => {
      if (!publicClient || !address || !relayerInstance || !signer) {
        throw new Error("Invalid parameters");
      }
      const presaleAddress = launchpadData.presaleAddress as Address;
      const [cipherContributions, cipherClaimableTokens] = await publicClient.multicall({
        contracts: [
          {
            abi: PrivacyPresale__factory.abi,
            address: presaleAddress,
            functionName: "contributions",
            args: [address as Address],
          },
          {
            abi: PrivacyPresale__factory.abi,
            address: presaleAddress,
            functionName: "claimableTokens",
            args: [address as Address],
          },
        ],
        allowFailure: false,
      });
      let contributionAmount = BigInt(0);
      let claimableTokensAmount = BigInt(0);

      if (cipherContributions !== ethers.ZeroHash) {
        const keypair = relayerInstance.generateKeypair();
        const handleContractPairs = [
          { handle: cipherContributions, contractAddress: presaleAddress },
          { handle: cipherClaimableTokens, contractAddress: presaleAddress },
        ];
        const startTimeStamp = Math.floor(Date.now() / 1000).toString();
        const durationDays = "1"; // String for consistency
        const contractAddresses = [presaleAddress, presaleAddress];

        const eip712 = relayerInstance!.createEIP712(
          keypair.publicKey,
          contractAddresses,
          startTimeStamp,
          durationDays
        );

        const signature = await signer.signTypedData(
          eip712.domain,
          {
            UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
          },
          eip712.message
        );

        const result = await relayerInstance.userDecrypt(
          handleContractPairs,
          keypair.privateKey,
          keypair.publicKey,
          signature.replace("0x", ""),
          contractAddresses,
          signer.address,
          startTimeStamp,
          durationDays
        );
        contributionAmount = result[cipherContributions] as bigint;
        claimableTokensAmount = result[cipherClaimableTokens] as bigint;
      }
      // Simulate fetching user contribution data
      return {
        contributedAmount: contributionAmount, // Example: 1 CWETH
        claimableTokens: claimableTokensAmount, // Example: 50k tokens
      };
    },
    onError: (error) => {
      console.error("Error fetching contribution data:", error);
      toast.error("Failed to fetch contribution data. Please try again.");
      setIsRevealed(false);
    },
    onSuccess: () => {
      setIsRevealed(true);
    },
  });

  const contributedAmount = data?.contributedAmount;

  const formatContributedAmount = () => {
    if (data?.contributedAmount === BigInt(0)) return "0";
    return formatNumber(data?.contributedAmount ? formatUnits(data?.contributedAmount, CWETH.decimals) : 0, {
      fractionDigits: CWETH.decimals,
    });
  };

  const formatClaimableTokens = () => {
    if (data?.claimableTokens === BigInt(0)) return "0";
    return formatNumber(data?.claimableTokens ? formatUnits(data?.claimableTokens, 9) : 0, {
      fractionDigits: 6,
    });
  };

  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white">Your Contribution</CardTitle>
          <button
            onClick={() => {
              if (!isRevealed) {
                fetchInfo();
              } else {
                setIsRevealed(false);
              }
            }}
            className="p-2 hover:bg-neutral-800 transition-colors"
            aria-label={isRevealed ? "Hide contribution details" : "Show contribution details"}
          >
            {isRevealed ? (
              <EyeOff className="w-5 h-5 text-neutral-400" />
            ) : (
              <Eye className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isRevealed ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-400">Contributed Amount</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white">{formatContributedAmount()}</div>
                <div className="text-xs text-neutral-500">{CWETH.symbol}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-400">Claimable Tokens</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white">{formatClaimableTokens()}</div>
                <div className="text-xs text-neutral-500">{launchpadData.token.symbol}</div>
              </div>
            </div>

            {contributedAmount != undefined && contributedAmount > BigInt(0) && (
              <div className="pt-2 border-t border-neutral-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Your Share</span>
                  <span className="text-white">
                    {(
                      (Number(formatUnits(contributedAmount, CWETH.decimals)) /
                        Number(formatUnits(BigInt(launchpadData.hardCap), CWETH.decimals))) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : isInfoLoading ? (
          <div className="flex items-center justify-center py-8 flex-col gap-1">
            <Loader2 className="size-5 animate-spin" />
            <p className="text-sm">Loading your contribution info...</p>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-neutral-600" />
              </div>
              <p className="text-sm text-neutral-500">Click the eye icon to view your contribution details</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
