import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function UnWrapTabContent() {
  const [wrapAmount, setWrapAmount] = useState("");
  const [wrapStatus, setWrapStatus] = useState("pending"); // pending, loading, success, error
  const [transactionHash, setTransactionHash] = useState("");
  const [ethBalance, setEthBalance] = useState("2.5847");
  const [cwethBalance, setCwethBalance] = useState("0.0000");

  const handleUnwrapETH = async () => {
    if (!wrapAmount || Number.parseFloat(wrapAmount) <= 0) return;

    setWrapStatus("loading");

    try {
      // Simulate unwrapping process
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setTransactionHash("0xfedcba0987654321fedcba0987654321fedcba09");
      setWrapStatus("success");

      // Update balances
      const unwrapAmountNum = Number.parseFloat(wrapAmount);
      setEthBalance((prev) => (Number.parseFloat(prev) + unwrapAmountNum).toFixed(4));
      setCwethBalance((prev) => (Number.parseFloat(prev) - unwrapAmountNum).toFixed(4));
    } catch (error) {
      setWrapStatus("error");
    }
  };

  const setMaxAmount = (isWrap: boolean) => {
    if (isWrap) {
      // Leave some ETH for gas fees
      const maxWrap = Math.max(0, Number.parseFloat(ethBalance) - 0.01);
      setWrapAmount(maxWrap.toFixed(4));
    } else {
      setWrapAmount(cwethBalance);
    }
  };

  return (
    <TabsContent value="unwrap" className="space-y-4">
      <div className="bg-neutral-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-400">Amount to Unwrap</span>
          <Button
            variant="link"
            onClick={() => setMaxAmount(false)}
            className="text-primary text-xs p-0 h-auto hover:text-yellow-500"
          >
            MAX
          </Button>
        </div>
        <div className="relative">
          <Input
            placeholder="0.0"
            value={wrapAmount}
            onChange={(e) => setWrapAmount(e.target.value)}
            className="bg-neutral-700 border-neutral-600 text-white text-right pr-20 text-lg font-mono"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-sm text-primary font-medium">CWETH</span>
          </div>
        </div>
        <div className="text-xs text-neutral-400 mt-2">
          You will receive: <span className="text-white font-mono">{wrapAmount || "0.0"} ETH</span>
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/30 p-3">
        <div className="text-xs text-orange-400 mb-1">⚠️ Gas Fees</div>
        <div className="text-xs text-neutral-300">
          Unwrapping requires gas fees to be paid in ETH. Make sure you have some ETH for transaction costs.
        </div>
      </div>

      {wrapStatus === "success" && (
        <div className="bg-green-500/10 border border-green-500/30 p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">CWETH Unwrapped Successfully!</span>
          </div>
          <div className="text-xs text-neutral-400">
            Transaction:
            <code className="ml-1 text-green-400 font-mono text-xs">{transactionHash}</code>
          </div>
        </div>
      )}

      {wrapStatus === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">Unwrapping failed. Please try again.</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleUnwrapETH}
        disabled={
          wrapStatus === "loading" ||
          !wrapAmount ||
          Number.parseFloat(wrapAmount) <= 0 ||
          Number.parseFloat(wrapAmount) > Number.parseFloat(cwethBalance)
        }
        className="w-full bg-primary hover:bg-primary/80 text-black font-semibold"
      >
        {wrapStatus === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Unwrapping...
          </>
        ) : (
          "Unwrap CWETH to ETH"
        )}
      </Button>
    </TabsContent>
  );
}
