import { TPresale } from "@/@types/launchpad.types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ConnectButton from "@/components/WalletButton/ConnectButton";
import { ApprovalState, useConfidentialApproveCallback } from "@/hooks/useApproveCallback";
import { usePrivacyPresaleContractWrite } from "@/hooks/useContract";
import useWeb3 from "@/hooks/useWeb3";
import useZamaRelayerInstance from "@/hooks/useZamaRelayerInstance";
import { toastTxSuccess } from "@/lib/toast";
import yup from "@/lib/yup";
import { getErrorMessage } from "@/utils/error";
import { Token } from "@/web3/core/entities";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseUnits } from "viem";

const formSchema = yup.object().shape({
  amount: yup.number().label("Amount").required("Amount is required").moreThan(0, "Amount must be greater than 0"),
});

type FormValues = yup.InferType<typeof formSchema>;

export default function PresaleForm({ launchpadData, CWETH }: { launchpadData: TPresale; CWETH: Token }) {
  const { address } = useWeb3();

  const presaleContract = usePrivacyPresaleContractWrite(launchpadData.presaleAddress);
  const relayerInstance = useZamaRelayerInstance();

  const form = useForm({
    defaultValues: {
      amount: undefined,
    },
    resolver: yupResolver(formSchema),
  });

  const formValues = form.watch();

  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 9,
    minutes: 52,
    seconds: 47,
  });

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

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          <div className="bg-orange-500/10 border border-orange-500/30 p-3">
            <div className="text-orange-400 text-sm font-medium">AFFILIATE</div>
            <div className="text-white text-xs mt-1">Presale Starts In</div>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-neutral-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{timeLeft.days.toString().padStart(2, "0")}</div>
              <div className="text-xs text-neutral-400">Days</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{timeLeft.hours.toString().padStart(2, "0")}</div>
              <div className="text-xs text-neutral-400">Hours</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{timeLeft.minutes.toString().padStart(2, "0")}</div>
              <div className="text-xs text-neutral-400">Min</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{timeLeft.seconds.toString().padStart(2, "0")}</div>
              <div className="text-xs text-neutral-400">Sec</div>
            </div>
          </div>

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
                      !form.formState.isValid
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
              <Badge className="bg-blue-500/20 text-blue-400">Upcoming</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Sale Type</span>
              <span className="text-white">Public</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Current Raised</span>
              <span className="text-white">? {CWETH.symbol}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
