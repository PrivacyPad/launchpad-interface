import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCWETHBalanceMutation } from "@/hooks/useBalance";
import useWeb3 from "@/hooks/useWeb3";
import { useCwethWrapModal } from "@/state/modal/cweth-wrap";
import { getErrorMessage } from "@/utils/error";
import { formatNumber } from "@/utils/format";
import { ArrowUpDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBalance } from "wagmi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import UnWrapTabContent from "./UnWrapTabContent";
import WrapTabContent from "./WrapTabContent";

export default function CwethWrapModal() {
  const { address } = useWeb3();
  const { open, setModalOpen } = useCwethWrapModal();

  const [showCwethBalance, setShowCwethBalance] = useState(false);

  const {
    data: cWETHBalance,
    isPending,
    mutateAsync: fetchCwethBalance,
  } = useCWETHBalanceMutation(address, {
    onError: (error) => {
      console.error("Error fetching cWETH balance:", error);
      toast.error("Failed to fetch cWETH balance.", { description: getErrorMessage(error) });
      setShowCwethBalance(false);
    },
  });

  const { data: ethBalance } = useBalance({
    address: address,
  });

  return (
    <Dialog open={open} onOpenChange={setModalOpen}>
      <DialogContent
        className="bg-neutral-900 border-neutral-700 text-white max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault(); // Prevent closing on outside click
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-yellow-500 rounded-full flex items-center justify-center">
              <ArrowUpDown className="w-4 h-4 text-white" />
            </div>
            cWETH WRAPPER
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Balance Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-800 rounded-xs p-3">
              <div className="text-xs text-neutral-400 mb-1">ETH BALANCE</div>
              <div className="text-lg font-bold text-white font-mono">
                {formatNumber(ethBalance?.formatted, { fractionDigits: 5 })}
              </div>
            </div>
            <div className="bg-neutral-800 rounded-xs p-3">
              <div className="text-xs text-neutral-400 mb-1">cWETH BALANCE</div>
              <div className="text-lg font-bold text-primary font-mono flex items-center gap-2">
                {/* Reveal/Hide cWETH balance */}
                <div className="flex-1">
                  {showCwethBalance ? (
                    <>
                      {isPending ? (
                        <div className="animate-pulse h-6 bg-neutral-700 w-30 rounded-xs" />
                      ) : (
                        formatNumber(cWETHBalance?.formatted, { fractionDigits: 5 })
                      )}
                    </>
                  ) : (
                    "••••••"
                  )}
                </div>
                {showCwethBalance ? (
                  <Tooltip>
                    <TooltipTrigger onClick={() => setShowCwethBalance(false)}>
                      <EyeOff className="w-5 h-5 text-neutral-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-sm font-medium">Hide balance</span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => {
                        fetchCwethBalance();
                        setShowCwethBalance(true);
                      }}
                    >
                      <Eye className="w-5 h-5 text-neutral-400 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-sm font-medium">Reveal balance</span>
                    </TooltipContent>
                  </Tooltip>
                )}
                {/* <button
                  type="button"
                  className="ml-2 text-neutral-400 hover:text-primary focus:outline-none"
                  onClick={() => setShowCwethBalance((prev) => !prev)}
                  aria-label={showCwethBalance ? "Hide balance" : "Reveal balance"}
                >
                  {showCwethBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button> */}
              </div>
            </div>
          </div>

          {/* Wrap/Unwrap Tabs */}
          <Tabs defaultValue="wrap" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
              <TabsTrigger value="wrap" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                Wrap ETH
              </TabsTrigger>
              <TabsTrigger value="unwrap" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                Unwrap cWETH
              </TabsTrigger>
            </TabsList>

            {/* Wrap Tab */}
            <WrapTabContent />

            {/* Unwrap Tab */}
            <UnWrapTabContent />
          </Tabs>

          {/* Close Button */}
          {/* <Button
            variant="outline"
            onClick={resetWrapDialog}
            className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 bg-transparent"
          >
            Close
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
