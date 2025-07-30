import { EPresaleStatus, TPresale } from "@/@types/launchpad.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePresaleStatus } from "@/hooks/usePresale";
import { formatNumber } from "@/utils/format";
import { formatDistance } from "date-fns";
import _ from "lodash";
import { Clock, Users } from "lucide-react";
import Link from "next/link";
import { formatUnits } from "viem";

const getStatusConfig = (status: EPresaleStatus) => {
  switch (status) {
    case EPresaleStatus.Upcoming:
      return {
        bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/50",
        text: "text-blue-400",
        badge: "bg-blue-500/20 text-blue-400",
        icon: "🚀",
      };
    // case "active":
    //   return {
    //     bg: "bg-gradient-to-br from-primary/30 via-yellow-500/20 to-orange-500/30",
    //     border: "border-primary shadow-lg shadow-primary/20",
    //     text: "text-primary",
    //     badge: "bg-primary/20 text-primary",
    //     icon: "⚡",
    //   };
    case EPresaleStatus.Completed:
      return {
        bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
        border: "border-green-500/50",
        text: "text-green-400",
        badge: "bg-green-500/20 text-green-400",
        icon: "✅",
      };
    case EPresaleStatus.Failed:
      return {
        bg: "bg-gradient-to-r from-red-500/20 to-pink-500/20",
        border: "border-red-500/50",
        text: "text-red-400",
        badge: "bg-red-500/20 text-red-400",
        icon: "❌",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-neutral-800/50 to-neutral-700/50",
        border: "border-neutral-600",
        text: "text-neutral-400",
        badge: "bg-neutral-500/20 text-neutral-400",
        icon: "⏳",
      };
  }
};

export default function PresaleItem({ presale }: { presale: TPresale }) {
  const status = usePresaleStatus(presale);
  const statusConfig = getStatusConfig(status);

  const raised = presale.raisedAmount ? formatUnits(BigInt(presale.raisedAmount), 9) : "0";
  const target = presale.hardCap ? formatUnits(BigInt(presale.hardCap), 9) : "0";

  const progress = (Number(raised) / Number(target)) * 100 || 0;

  return (
    <div
      key={presale.id}
      className={`${statusConfig.bg} ${statusConfig.border} border p-6 transition-all duration-300 hover:scale-[1.01] group relative overflow-hidden`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={presale.token.icon || undefined} alt={presale.token.name} className="object-cover" />
              <AvatarFallback className="bg-primary text-black">
                <span className="text-lg font-bold">{presale.token.symbol.charAt(0)}</span>
              </AvatarFallback>
            </Avatar>
            {/* <div
              className={`w-12 h-12 ${status === EPresaleStatus.Active ? "bg-gradient-to-br from-primary via-yellow-500 to-orange-500 shadow-lg shadow-primary/50" : "bg-gradient-to-br from-primary to-yellow-500"} flex items-center justify-center`}
            >
              <span className="text-black text-lg font-bold">{presale.symbol.charAt(0)}</span>
            </div> */}
            <div>
              <h3
                className={`text-lg font-bold ${status === EPresaleStatus.Active ? "text-white group-hover:text-primary bg-gradient-to-r from-white to-primary bg-clip-text" : "text-white group-hover:text-primary"} transition-colors`}
              >
                {presale.token.name}
              </h3>
              <p className="text-sm text-neutral-400">{presale.token.symbol}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{statusConfig.icon}</span>
            <div
              className={`px-3 py-1 text-xs font-medium ${status === EPresaleStatus.Active ? "bg-gradient-to-r from-primary to-yellow-500 text-black shadow-lg" : statusConfig.badge}`}
            >
              {status.toUpperCase()}
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-300 mb-4 line-clamp-2">{presale.description}</p>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400">Progress</span>
            <div className="flex items-center gap-2">
              <span className={`${status === EPresaleStatus.Active ? "text-primary font-bold" : statusConfig.text}`}>
                {status === EPresaleStatus.Active
                  ? "? / ?"
                  : `${formatNumber(raised, { fractionDigits: 4 })} / ${formatNumber(target, { fractionDigits: 4 })} cWETH`}
              </span>
              <span className="text-neutral-500">{status === EPresaleStatus.Active ? "(?%)" : `(${progress}%)`}</span>
            </div>
          </div>

          {status !== EPresaleStatus.Upcoming && status !== EPresaleStatus.Active && (
            <div className={`w-full bg-neutral-800 h-3 overflow-hidden`}>
              <div
                className={`h-3 transition-all duration-500 ${
                  status === EPresaleStatus.Completed
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : status === EPresaleStatus.Failed
                      ? "bg-gradient-to-r from-red-500 to-pink-500"
                      : "bg-gradient-to-r from-primary via-yellow-500 to-orange-500 shadow-lg"
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistance(presale.startTime, presale.endTime, {
                    addSuffix: false,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{status === EPresaleStatus.Upcoming ? 0 : _.random(10, 1000)}</span>
              </div>
            </div>
            <Button
              size="sm"
              className={`bg-gradient-to-r from-primary to-yellow-500 text-black font-semibold hover:opacity-80 transition-all`}
              asChild
            >
              <Link href={`/launchpad/${presale.presaleAddress}`}>View</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
