import { TToken } from "@/@types/token.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { Clock, DollarSign, Rocket, Target } from "lucide-react";

export default function PresalePreview({
  launchpadData,
  erc20Info,
}: {
  launchpadData: {
    softCap?: number;
    hardCap?: number;
    startDate?: Date;
    endDate?: Date;
    liquidityLockup?: number;
  };
  erc20Info?: TToken;
}) {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PRESALE PREVIEW</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-neutral-800 rounded">
          <div className="flex justify-center mb-3">
            <Avatar className="size-16">
              <AvatarImage src={erc20Info?.icon || undefined} alt={erc20Info?.name} />
              <AvatarFallback className="bg-primary text-black">
                <Rocket className="w-8 h-8 text-black" />
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-white font-bold">{erc20Info?.name || "Token Name"}</h3>
          <p className="text-neutral-400 text-sm">{erc20Info?.symbol || "SYMBOL"}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-neutral-400">Soft Cap:</span>
            <span className="text-white">{launchpadData.softCap || "0"} cWETH</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-neutral-400">Hard Cap:</span>
            <span className="text-white">{launchpadData.hardCap || "0"} cWETH</span>
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
          {/* <div className="flex items-center gap-2 text-sm">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-neutral-400">Liquidity Lock:</span>
            <span className="text-white">{launchpadData?.liquidityLockup || 0} days</span>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
