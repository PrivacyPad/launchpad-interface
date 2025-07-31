import { EPresaleOnchainState, EPresaleStatus, TPresale } from "@/@types/launchpad.types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ConnectButton from "@/components/WalletButton/ConnectButton";
import { ApprovalState, useConfidentialApproveCallback } from "@/hooks/useApproveCallback";
import { usePrivacyPresaleContractWrite } from "@/hooks/useContract";
import { usePresalePoolInfo, usePresaleStatus } from "@/hooks/usePresale";
import useWeb3 from "@/hooks/useWeb3";
import useZamaRelayerInstance from "@/hooks/useZamaRelayerInstance";
import { toastTxSuccess } from "@/lib/toast";
import yup from "@/lib/yup";
import { getErrorMessage } from "@/utils/error";
import { formatNumber } from "@/utils/format";
import { Token } from "@/web3/core/entities";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatEther, parseUnits } from "viem";
import CountdownTimer from "./Timer";

const formSchema = yup.object().shape({
  amount: yup.number().label("Amount").required("Amount is required").moreThan(0, "Amount must be greater than 0"),
});

type FormValues = yup.InferType<typeof formSchema>;

export default function PresaleForm({ launchpadData, CWETH }: { launchpadData: TPresale; CWETH: Token }) {
  const { address } = useWeb3();

  const presaleContract = usePrivacyPresaleContractWrite(launchpadData.presaleAddress);
  const relayerInstance = useZamaRelayerInstance();

  const { data: poolInfo } = usePresalePoolInfo(launchpadData.presaleAddress, {
    refetchInterval: false,
  });

  const status = usePresaleStatus(launchpadData, poolInfo);

  const form = useForm({
    defaultValues: {
      amount: undefined,
    },
    resolver: yupResolver(formSchema),
  });

  const formValues = form.watch();

  const [approvalState, approve] = useConfidentialApproveCallback({
    currency: CWETH,
    spender: launchpadData.presaleAddress,
    onReceipt: (tx) => {
      if (tx?.hash) {
        toastTxSuccess("Approval successful", tx.hash);
      } else {
        toast.success("Approval successful");
      }
    },
    onError: (error) => {
      console.error("Approval error:", error);
      toast.error("Approval failed. Please try again.");
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!presaleContract) {
        throw new Error("Presale contract is not available");
      }
      if (!address) {
        throw new Error("Wallet not connected");
      }
      if (!relayerInstance) {
        throw new Error("Relayer is not available");
      }
      const amount = parseUnits(data.amount.toString(), CWETH.decimals);
      const eAmount = await relayerInstance
        .createEncryptedInput(presaleContract.target as string, address)
        .add64(amount)
        .encrypt();
      const tx = await presaleContract.purchase(address, eAmount.handles[0], eAmount.inputProof);
      await tx.wait();
      toastTxSuccess("Contribution successful", tx.hash);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to contribute", { description: getErrorMessage(error) });
    }
  };

  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardContent className="">
        <div className="text-center space-y-4">
          <div className="bg-primary/10 border border-primary/30 p-3">
            <div className="text-primary text-sm font-medium">PRESALE</div>
            <div className="text-white text-xs mt-1">
              {status === EPresaleStatus.Upcoming && "Presale Starts In"}
              {status === EPresaleStatus.Active && "Presale Ends In"}
              {status === EPresaleStatus.Completed && "Completed Presale"}
              {status === EPresaleStatus.Failed && "Failed Presale"}
            </div>
          </div>

          {/* Countdown Timer */}
          {status === EPresaleStatus.Upcoming && <CountdownTimer to={new Date(launchpadData.startTime).getTime()} />}
          {status === EPresaleStatus.Active && <CountdownTimer to={new Date(launchpadData.endTime).getTime()} />}

          {/* Token Info */}

          {/* Investment Interface */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="relative space-y-2">
                <Label htmlFor="amount" className="text-xs text-neutral-400 tracking-wider">
                  AMOUNT
                </Label>
                <Input.Number
                  id="amount"
                  placeholder="0"
                  {...form.register("amount")}
                  value={formValues.amount || ""}
                  className="bg-neutral-800 border-neutral-600 text-white pr-24"
                  endIcon={
                    <div className="flex items-center gap-1">
                      <Avatar className="size-5">
                        <AvatarImage src={CWETH.logo} alt={CWETH.symbol} />
                      </Avatar>
                      <span className="text-sm font-medium text-white">{CWETH.symbol}</span>
                    </div>
                  }
                />
              </div>

              {!address ? (
                <ConnectButton className="w-full bg-primary hover:bg-primary/80 text-black font-semibold" />
              ) : (
                <div className="space-y-2">
                  {approvalState !== ApprovalState.APPROVED && (
                    <Button
                      type="button"
                      className="w-full bg-primary hover:bg-primary/80 text-black font-semibold"
                      onClick={() => approve()}
                      disabled={approvalState === ApprovalState.PENDING || approvalState === ApprovalState.UNKNOWN}
                      loading={approvalState === ApprovalState.PENDING}
                      loadingText="Approving..."
                    >
                      Approve {CWETH.symbol}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      approvalState !== ApprovalState.APPROVED ||
                      form.formState.isSubmitting ||
                      form.formState.isLoading ||
                      !form.formState.isValid ||
                      status !== EPresaleStatus.Active
                    }
                    loading={form.formState.isSubmitting || form.formState.isLoading}
                    loadingText="Contributing..."
                  >
                    Contribute
                  </Button>
                </div>
              )}
            </div>
          </form>

          {/* Status Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">Status</span>
              {status === EPresaleStatus.Upcoming ? (
                <Badge className="bg-blue-500/20 text-blue-400">Upcoming</Badge>
              ) : status === EPresaleStatus.Active ? (
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              ) : status === EPresaleStatus.Completed ? (
                <Badge className="bg-gray-500/20 text-gray-400">Completed</Badge>
              ) : status === EPresaleStatus.Failed ? (
                <Badge className="bg-red-500/20 text-red-400">Failed</Badge>
              ) : status === EPresaleStatus.Ended ? (
                <Badge className="bg-yellow-500/20 text-yellow-400">Ended</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Sale Type</span>
              <span className="text-white">Public</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Current Raised</span>
              <span className="text-white">
                {poolInfo && [EPresaleOnchainState.CANCELED, EPresaleOnchainState.FINALIZED].includes(poolInfo.state)
                  ? formatNumber(formatEther(poolInfo!.weiRaise), { fractionDigits: 5 })
                  : "?"}{" "}
                {CWETH.symbol}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
