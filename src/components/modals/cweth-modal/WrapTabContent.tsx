import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";

export default function WrapTabContent() {
  const [wrapAmount, setWrapAmount] = useState("");
  const [wrapStatus, setWrapStatus] = useState("pending"); // pending, loading, success, error
  const [transactionHash, setTransactionHash] = useState("");
  const [ethBalance, setEthBalance] = useState("2.5847");
  const [cwethBalance, setCwethBalance] = useState("0.0000");

  const handleWrapETH = async () => {
    if (!wrapAmount || Number.parseFloat(wrapAmount) <= 0) return;

    setWrapStatus("loading");

    try {
      // Simulate wrapping process
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setTransactionHash("0xabcdef1234567890abcdef1234567890abcdef12");
      setWrapStatus("success");

      // Update balances
      const wrapAmountNum = Number.parseFloat(wrapAmount);
      setEthBalance((prev) => (Number.parseFloat(prev) - wrapAmountNum).toFixed(4));
      setCwethBalance((prev) => (Number.parseFloat(prev) + wrapAmountNum).toFixed(4));
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
    <TabsContent value="wrap" className="space-y-4">
      <div className="bg-neutral-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-400">Amount to Wrap</span>
          <Button
            variant="link"
            onClick={() => setMaxAmount(true)}
            className="text-primary text-xs p-0 h-auto hover:text-yellow-500"
          >
            MAX
          </Button>
        </div>
        <div className="relative">
          <Input.Number
            autoFocus
            placeholder="0.0"
            value={wrapAmount}
            onChange={(e) => setWrapAmount(e.target.value)}
            className="bg-neutral-700 border-neutral-600 text-white text-right pr-16 text-lg font-mono"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-sm text-white font-medium">ETH</span>
          </div>
        </div>
        <div className="text-xs text-neutral-400 mt-2">
          You will receive: <span className="text-primary font-mono">{wrapAmount || "0.0"} CWETH</span>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30 p-3">
        <div className="text-xs text-primary mb-1">ℹ️ About CWETH</div>
        <div className="text-xs text-neutral-300">
          CWETH is the confidential WETH token. It is a wrapped version of ETH that enables private transactions and can
          be used in DeFi protocols.
          <br />1 ETH = 1 CWETH always.
        </div>
      </div>

      {wrapStatus === "success" && (
        <div className="bg-green-500/10 border border-green-500/30 p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">ETH Wrapped Successfully!</span>
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
            <span className="text-sm text-red-400">Wrapping failed. Please try again.</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleWrapETH}
        disabled={wrapStatus === "loading" || !wrapAmount || Number.parseFloat(wrapAmount) <= 0}
        className="w-full bg-primary hover:bg-primary/80 text-black font-semibold"
      >
        {wrapStatus === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Wrapping...
          </>
        ) : (
          "Wrap ETH to CWETH"
        )}
      </Button>
    </TabsContent>
  );
}
