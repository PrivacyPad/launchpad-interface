import { TPresale } from "@/@types/launchpad.types";
import { CopyButton } from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/utils/format";
import { Token } from "@/web3/core/entities";
import { format } from "date-fns";
import { formatUnits } from "viem";

export default function PoolInfo({ launchpadData, CWETH }: { launchpadData: TPresale; CWETH: Token }) {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">Pool Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-neutral-700">
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium w-1/3">Address</td>
                <td className="py-3 text-sm text-white">
                  <div className="flex items-center gap-2">
                    <div className="bg-neutral-800 px-2 py-1 rounded text-primary text-sm truncate min-w-0">
                      {launchpadData.presaleAddress}
                    </div>
                    <CopyButton text={launchpadData.presaleAddress} />
                  </div>
                </td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium w-1/3">cToken Address</td>
                <td className="py-3 text-sm text-white">
                  <div className="flex items-center gap-2">
                    <div className="bg-neutral-800 px-2 py-1 rounded text-primary text-sm truncate min-w-0">
                      {launchpadData.cTokenAddress}
                    </div>
                    <CopyButton text={launchpadData.cTokenAddress} />
                  </div>
                </td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Tokens For Presale</td>
                <td className="py-3 text-sm text-white">
                  {formatNumber(formatUnits(BigInt(launchpadData.tokensForSale), launchpadData.token.decimals))}{" "}
                  {launchpadData.token.symbol}
                </td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Tokens For Liquidity</td>
                <td className="py-3 text-sm text-white">
                  {formatNumber(formatUnits(BigInt(launchpadData.tokensForLiquidity), launchpadData.token.decimals))}{" "}
                  {launchpadData.token.symbol}
                </td>
              </tr>
              {/* <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Initial Market Cap</td>
                      <td className="py-3 text-sm text-white">{launchpadData.initialMarketCap}</td>
                    </tr> */}
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Soft Cap</td>
                <td className="py-3 text-sm text-white">
                  {formatNumber(formatUnits(BigInt(launchpadData.softCap), CWETH.decimals), {
                    fractionDigits: CWETH.decimals,
                  })}{" "}
                  {CWETH.symbol}
                </td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Hard Cap</td>
                <td className="py-3 text-sm text-white">
                  {formatNumber(formatUnits(BigInt(launchpadData.hardCap), CWETH.decimals), {
                    fractionDigits: CWETH.decimals,
                  })}{" "}
                  {CWETH.symbol}
                </td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Start Time</td>
                <td className="py-3 text-sm text-white">{format(launchpadData.startTime, "PPpp")}</td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">End Time</td>
                <td className="py-3 text-sm text-white">{format(launchpadData.endTime, "PPpp")}</td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Listing On</td>
                <td className="py-3 text-sm">
                  <span className="text-primary font-medium">Uniswap</span>
                </td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Liquidity Percent</td>
                <td className="py-3 text-sm text-white">{Number(launchpadData.liquidityPercent) / 100}%</td>
              </tr>
              {/* <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Liquidity Lockup Time</td>
                <td className="py-3 text-sm text-white">
                  {formatDistance(0, launchpadData.liquidityLockTime * 1000, { includeSeconds: true })}
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
