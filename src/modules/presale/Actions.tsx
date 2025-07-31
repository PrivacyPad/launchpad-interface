import { EPresaleOnchainState, TPresale } from "@/@types/launchpad.types";
import Button from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivacyPresaleContractWrite } from "@/hooks/useContract";
import { usePresalePoolInfo } from "@/hooks/usePresale";
import { toastTxSuccess } from "@/lib/toast";
import { getErrorMessage } from "@/utils/error";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Actions({ launchpadData, address }: { launchpadData: TPresale; address: string }) {
  const presaleContract = usePrivacyPresaleContractWrite(launchpadData.presaleAddress);

  const poolQuery = usePresalePoolInfo(launchpadData.presaleAddress);
  console.debug("🚀 ~ Actions ~ poolQuery:", poolQuery.isFetching);

  const presaleState = poolQuery.data?.state;

  const isSaleEnded = new Date(launchpadData.endTime).getTime() < Date.now();

  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!presaleContract) {
        throw new Error("Presale contract not available");
      }
      const tx = await presaleContract.claimTokens(address);
      await tx.wait();
      return tx;
    },
    onError: (error) => {
      toast.error(`Error claiming tokens`, { description: getErrorMessage(error) });
    },
    onSuccess: (tx) => {
      if (tx.hash) {
        toastTxSuccess("Claim successful", tx.hash);
      } else {
        toast.success("Claim successful");
      }
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: async () => {
      if (!presaleContract) {
        throw new Error("Presale contract not available");
      }
      const tx = await presaleContract.requestFinalizePresaleState();
      await tx.wait();
      return tx;
    },
    onError: (error) => {
      toast.error(`Error finalizing presale`, { description: getErrorMessage(error) });
    },
    onSuccess: (tx) => {
      if (tx.hash) {
        toastTxSuccess("Request finalization successful", tx.hash);
      } else {
        toast.success("Request finalization successful");
      }
      poolQuery.refetch();
    },
  });

  const refundMutation = useMutation({
    mutationFn: async () => {
      if (!presaleContract) {
        throw new Error("Presale contract not available");
      }
      const tx = await presaleContract.refund(address);
      await tx.wait();
      return tx;
    },
    onError: (error) => {
      toast.error(`Error requesting refund`, { description: getErrorMessage(error) });
    },
    onSuccess: (tx) => {
      if (tx.hash) {
        toastTxSuccess("Refund requested successfully", tx.hash);
      } else {
        toast.success("Refund requested successfully");
      }
    },
  });

  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="font-bold text-white">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full"
          onClick={() => finalizeMutation.mutate()}
          loading={finalizeMutation.isPending}
          disabled={
            finalizeMutation.isPending ||
            finalizeMutation.isSuccess ||
            presaleState !== EPresaleOnchainState.ACTIVE ||
            !isSaleEnded
          }
          loadingText="Finalizing..."
        >
          Request Finalization
        </Button>
        {presaleState === EPresaleOnchainState.FINALIZED && (
          <Button
            className="w-full"
            loading={claimMutation.isPending}
            loadingText="Claiming..."
            disabled={claimMutation.isPending || claimMutation.isSuccess}
            onClick={() => claimMutation.mutate()}
          >
            Claim Tokens
          </Button>
        )}
        {presaleState === EPresaleOnchainState.CANCELED && (
          <Button
            className="w-full"
            onClick={() => refundMutation.mutate()}
            loading={refundMutation.isPending}
            disabled={refundMutation.isPending || refundMutation.isSuccess}
            loadingText="Refunding..."
          >
            Refund
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
