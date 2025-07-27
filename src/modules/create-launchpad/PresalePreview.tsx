import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { Clock, DollarSign, Rocket, Target } from "lucide-react";
import React from "react";

export default function PresalePreview({
  launchpadData,
}: {
  launchpadData: {
    tokenName?: string;
    tokenSymbol?: string;
    softCap?: number;
    hardCap?: number;
    startDate?: Date;
    endDate?: Date;
  };
}) {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PRESALE PREVIEW</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-neutral-800 rounded">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
            <Rocket className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-white font-bold">{launchpadData.tokenName || "Token Name"}</h3>
          <p className="text-neutral-400 text-sm">{launchpadData.tokenSymbol || "SYMBOL"}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-neutral-400">Soft Cap:</span>
            <span className="text-white">{launchpadData.softCap || "0"} ETH</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-neutral-400">Hard Cap:</span>
            <span className="text-white">{launchpadData.hardCap || "0"} ETH</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-neutral-400">Duration:</span>
            <span className="text-white">
              {launchpadData.startDate && launchpadData.endDate
                ? formatDistance(launchpadData.startDate, launchpadData.endDate, {
                    addSuffix: false,
                  })
                : "Not set"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
